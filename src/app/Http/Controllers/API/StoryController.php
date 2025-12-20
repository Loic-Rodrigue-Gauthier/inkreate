<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoryResource;
use App\Models\Story;
use App\Repositories\StoryRepository;
use App\Services\SegmentGraph;
use App\Services\TextModerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

class StoryController extends Controller
{
    public function __construct(private StoryRepository $stories)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->only([
            'genre',
            'status',
            'owner',
            'min_rating',
            'search',
            'published_after',
            'sort',
        ]);

        $stories = $this->stories->paginate(
            $filters,
            $request->integer('per_page', 12),
            $request->boolean('with_root'),
        );

        return StoryResource::collection($stories);
    }

    public function store(Request $request, TextModerator $moderator): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'synopsis' => ['nullable', 'string'],
            'genre' => ['required', 'string', 'max:60'],
            'is_public' => ['boolean'],
            'is_collaborative' => ['boolean'],
            'allow_forks' => ['boolean'],
            'tags' => ['array'],
            'tags.*' => ['string', 'max:30'],
            'min_age' => ['integer', 'min:0', 'max:18'],
            'estimated_duration' => ['integer', 'min:1', 'max:240'],
            'cover_image_url' => ['nullable', 'string', 'max:2048'],
        ]);

        $synopsisModeration = $data['synopsis'] ? $moderator->filter($data['synopsis']) : null;

        $story = Story::create([
            'owner_id' => $request->user()->id,
            'title' => $data['title'],
            'slug' => $this->generateUniqueSlug($data['title']),
            'synopsis' => $synopsisModeration['text'] ?? $data['synopsis'],
            'genre' => $data['genre'],
            'status' => 'draft',
            'is_public' => $data['is_public'] ?? true,
            'is_collaborative' => $data['is_collaborative'] ?? true,
            'allow_forks' => $data['allow_forks'] ?? true,
            'tags' => $data['tags'] ?? [],
            'min_age' => $data['min_age'] ?? 0,
            'estimated_duration' => $data['estimated_duration'] ?? 10,
            'content_warnings' => [],
            'metadata' => [
                'language_flagged' => $synopsisModeration['flagged'] ?? false,
            ],
            'cover_image_url' => $this->sanitizeImagePath($data['cover_image_url'] ?? null),
        ]);

        return (new StoryResource($story->load('owner')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Story $story): StoryResource
    {
        $story = $this->stories->loadWithRootSegments($story);

        return new StoryResource($story);
    }

    public function graph(Story $story): JsonResponse
    {
        $segments = $story->segments()->with('choices')->get();
        $graph = SegmentGraph::fromSegments($segments);

        return response()->json([
            'story_id' => $story->id,
            'graph' => $graph->toArray(),
        ]);
    }

    public function update(Request $request, Story $story, TextModerator $moderator): StoryResource
    {
        abort_unless($request->user()->id === $story->owner_id, 403);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:120'],
            'synopsis' => ['nullable', 'string'],
            'genre' => ['sometimes', 'string', 'max:60'],
            'status' => ['sometimes', 'in:draft,published,completed,archived'],
            'is_public' => ['boolean'],
            'tags' => ['array'],
            'tags.*' => ['string', 'max:30'],
            'estimated_duration' => ['integer', 'min:1', 'max:240'],
            'published_at' => ['nullable', 'date'],
            'cover_image_url' => ['nullable', 'string', 'max:2048'],
        ]);

        if (isset($data['title']) && $story->title !== $data['title']) {
            $story->slug = $this->generateUniqueSlug($data['title']);
        }

        if (array_key_exists('synopsis', $data)) {
            $synopsisModeration = $data['synopsis'] ? $moderator->filter($data['synopsis']) : null;
            $data['synopsis'] = $synopsisModeration['text'] ?? null;
            $data['metadata'] = array_merge($story->metadata ?? [], [
                'language_flagged' => $synopsisModeration['flagged'] ?? false,
            ]);
        }

        if (array_key_exists('cover_image_url', $data)) {
            $data['cover_image_url'] = $this->sanitizeImagePath($data['cover_image_url']);
        }

        $story->fill($data)->save();

        return new StoryResource($story->refresh()->load('owner'));
    }

    private function generateUniqueSlug(string $title): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $suffix = 1;

        while (Story::where('slug', $slug)->exists()) {
            $suffix++;
            $slug = "{$base}-{$suffix}";
        }

        return $slug;
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
