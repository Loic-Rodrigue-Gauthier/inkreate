<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\SegmentResource;
use App\Models\Segment;
use App\Models\SegmentChoice;
use App\Models\Story;
use App\Repositories\SegmentRepository;
use App\Services\TextModerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SegmentController extends Controller
{
    public function __construct(private SegmentRepository $segments)
    {
    }

    public function index(Request $request, Story $story): AnonymousResourceCollection
    {
        $segments = $this->segments->listForStory($story, $request->integer('parent_segment_id'));

        return SegmentResource::collection($segments);
    }

    public function byChoice(Story $story, int $choiceId): AnonymousResourceCollection
    {
        $choiceModel = SegmentChoice::whereKey($choiceId)
            ->whereHas('segment', fn ($q) => $q->where('story_id', $story->id))
            ->first();

        if (! $choiceModel) {
            return SegmentResource::collection(collect());
        }

        $segments = $this->segments->listForChoice($story, $choiceModel->id);

        return SegmentResource::collection($segments);
    }

    public function update(Request $request, Segment $segment, TextModerator $moderator): SegmentResource
    {
        abort_unless(
            $request->user()->id === $segment->author_id || $request->user()->id === $segment->story->owner_id,
            403
        );

        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:120'],
            'content' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'is_terminal' => ['nullable', 'boolean'],
            'choices' => ['array'],
            'choices.*.id' => ['nullable', 'integer'],
            'choices.*.label' => ['required', 'string', 'max:120'],
            'choices.*.position' => ['nullable', 'integer', 'min:0'],
            'choices.*.is_locked' => ['nullable', 'boolean'],
        ]);

        if (array_key_exists('title', $data)) {
            $titleModeration = $data['title'] ? $moderator->filter($data['title']) : null;
            $segment->title = $titleModeration['text'] ?? $data['title'];
            $segment->moderation_flags = array_merge($segment->moderation_flags ?? [], [
                'title' => $titleModeration['flagged'] ?? false,
            ]);
        }

        if (array_key_exists('content', $data)) {
            $contentModeration = $data['content'] ? $moderator->filter($data['content']) : null;
            $segment->content = $contentModeration['text'] ?? $segment->content;
            $segment->reading_time_minutes = (int) max(1, ceil(str_word_count($segment->content) / 180));
            $segment->moderation_flags = array_merge($segment->moderation_flags ?? [], [
                'content' => $contentModeration['flagged'] ?? false,
            ]);
        }

        if (array_key_exists('image_url', $data)) {
            $segment->image_url = $this->sanitizeImagePath($data['image_url'] ?? null);
        }

        if (array_key_exists('is_terminal', $data)) {
            $segment->is_terminal = (bool) $data['is_terminal'];
        }

        $segment->save();

        if (isset($data['choices'])) {
            $providedIds = [];
            foreach ($data['choices'] as $index => $choiceData) {
                $choiceId = $choiceData['id'] ?? null;
                $labelModeration = $moderator->filter($choiceData['label']);

                if ($choiceId) {
                    $choice = $segment->choices()->where('id', $choiceId)->first();
                    if (! $choice) {
                        continue;
                    }
                    $choice->update([
                        'label' => $labelModeration['text'],
                        'position' => $choiceData['position'] ?? $choice->position,
                        'is_locked' => $choiceData['is_locked'] ?? $choice->is_locked,
                    ]);
                    $providedIds[] = $choice->id;
                } else {
                    $newChoice = $segment->choices()->create([
                        'label' => $labelModeration['text'],
                        'position' => $choiceData['position'] ?? $index,
                        'is_locked' => $choiceData['is_locked'] ?? false,
                    ]);
                    $providedIds[] = $newChoice->id;
                }
            }

            // Remove choices not provided if they are not linked to a next segment
            $segment->choices()
                ->whereNotIn('id', $providedIds)
                ->whereNull('next_segment_id')
                ->delete();
        }

        return new SegmentResource($segment->refresh()->load(['choices.nextSegment', 'author']));
    }

    public function store(Request $request, Story $story, TextModerator $moderator): JsonResponse
    {
        abort_if(
            ! $story->is_collaborative && $request->user()->id !== $story->owner_id,
            403,
        );

        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:120'],
            'content' => ['required', 'string'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'is_terminal' => ['boolean'],
            'parent_segment_id' => ['nullable', 'integer', 'exists:segments,id'],
            'parent_choice_id' => ['nullable', 'integer', 'exists:segment_choices,id'],
            'choices' => ['array'],
            'choices.*' => ['string', 'max:120'],
        ]);

        $parentSegment = null;
        if (! empty($data['parent_segment_id'])) {
            $parentSegment = Segment::where('story_id', $story->id)
                ->where('id', $data['parent_segment_id'])
                ->firstOrFail();
        }

        $parentChoice = null;
        if (! empty($data['parent_choice_id'])) {
            $parentChoice = SegmentChoice::whereHas('segment', fn ($query) => $query
                ->where('story_id', $story->id)
                ->when($parentSegment, fn ($q) => $q->where('id', $parentSegment->id)))
                ->whereNull('next_segment_id')
                ->findOrFail($data['parent_choice_id']);
        }

        $titleModeration = $data['title'] ? $moderator->filter($data['title']) : null;
        $contentModeration = $moderator->filter($data['content']);

        $segment = $story->segments()->create([
            'author_id' => $request->user()->id,
            'parent_segment_id' => $parentSegment?->id,
            'title' => $titleModeration['text'] ?? $data['title'],
            'content' => $contentModeration['text'],
            'image_url' => $this->sanitizeImagePath($data['image_url'] ?? null),
            'is_public' => true,
            'is_terminal' => $data['is_terminal'] ?? false,
            'reading_time_minutes' => (int) max(1, ceil(str_word_count($data['content']) / 180)),
            'sequence_order' => ($story->segments()->max('sequence_order') ?? 0) + 1,
            'moderation_flags' => [
                'title' => $titleModeration['flagged'] ?? false,
                'content' => $contentModeration['flagged'],
            ],
        ]);

        if ($parentChoice) {
            $parentChoice->update(['next_segment_id' => $segment->id]);
        }

        foreach ($data['choices'] ?? [] as $index => $label) {
            $choiceModeration = $moderator->filter($label);

            $segment->choices()->create([
                'label' => $choiceModeration['text'],
                'position' => $index,
                'is_locked' => false,
            ]);
        }

        $segment->load(['choices', 'author']);

        return (new SegmentResource($segment))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Segment $segment): SegmentResource
    {
        return new SegmentResource($this->segments->loadFull($segment));
    }

    public function addChoice(Request $request, Segment $segment, TextModerator $moderator): SegmentResource
    {
        abort_unless($request->user()->id === $segment->author_id || $request->user()->id === $segment->story->owner_id, 403);

        $data = $request->validate([
            'label' => ['required', 'string', 'max:120'],
            'position' => ['nullable', 'integer', 'min:0'],
        ]);

        $label = $moderator->filter($data['label']);

        $segment->choices()->create([
            'label' => $label['text'],
            'position' => $data['position'] ?? ($segment->choices()->max('position') ?? -1) + 1,
            'is_locked' => false,
        ]);

        return new SegmentResource($segment->refresh()->load(['choices.nextSegment', 'author']));
    }

    public function destroy(Request $request, Segment $segment): JsonResponse
    {
        abort_unless($request->user()->id === $segment->author_id || $request->user()->id === $segment->story->owner_id, 403);

        $segment->delete();

        return response()->json([
            'message' => 'Segment supprimé.',
        ]);
    }

    private function sanitizeImagePath(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        $clean = trim($value);

        $httpPos = max(
            strrpos($clean, 'http://') !== false ? strrpos($clean, 'http://') : -1,
            strrpos($clean, 'https://') !== false ? strrpos($clean, 'https://') : -1,
        );
        if ($httpPos > 0) {
            $clean = substr($clean, $httpPos);
            $path = parse_url($clean, PHP_URL_PATH) ?: '';
            $clean = $path ? ltrim($path, '/') : $clean;
        }

        return ltrim($clean, '/');
    }
}
