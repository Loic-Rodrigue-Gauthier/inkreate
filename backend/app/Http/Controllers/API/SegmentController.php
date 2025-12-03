<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\SegmentResource;
use App\Models\Segment;
use App\Models\SegmentChoice;
use App\Models\Story;
use App\Services\TextModerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SegmentController extends Controller
{
    public function index(Request $request, Story $story): AnonymousResourceCollection
    {
        $segments = $story->segments()
            ->when(
                $parentId = $request->integer('parent_segment_id'),
                fn ($query) => $query->where('parent_segment_id', $parentId),
                fn ($query) => $query->whereNull('parent_segment_id'),
            )
            ->with(['choices.nextSegment', 'author'])
            ->orderBy('sequence_order')
            ->get();

        return SegmentResource::collection($segments);
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
            'image_url' => ['nullable', 'url'],
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
            'image_url' => $data['image_url'] ?? null,
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
        $segment->load([
            'story:id,title,slug',
            'choices.nextSegment',
            'author',
            'comments.user',
        ]);

        return new SegmentResource($segment);
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
}
