<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'genre' => $this->genre,
            'synopsis' => $this->synopsis,
            'status' => $this->status,
            'is_public' => $this->is_public,
            'is_collaborative' => $this->is_collaborative,
            'allow_forks' => $this->allow_forks,
            'estimated_duration' => $this->estimated_duration,
            'min_age' => $this->min_age,
            'cover_image_url' => $this->absoluteUrl($this->cover_image_url),
            'tags' => $this->tags ?? [],
            'content_warnings' => $this->content_warnings ?? [],
            'rating' => [
                'average' => (float) $this->rating_average,
                'count' => $this->rating_count,
            ],
            'metrics' => [
                'reads' => $this->reading_count ?? $this->reads_count ?? $this->reads()->count(),
                'favorites' => $this->favorites_count,
                'segments' => $this->segments_count,
                'comments' => $this->comments_count ?? ($this->relationLoaded('comments') ? $this->comments->count() : $this->comments()->count()),
            ],
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'published_at' => optional($this->published_at)?->toIso8601String(),
            'owner' => UserResource::make($this->whenLoaded('owner')),
            'root_segments' => SegmentResource::collection($this->whenLoaded('rootSegments')),
        ];
    }

    private function absoluteUrl(?string $value): ?string
    {
        $path = $this->normalizePath($value);
        if (! $path) {
            return null;
        }

        $base = rtrim(config('app.url') ?: request()->getSchemeAndHttpHost() ?: url('/'), '/');

        return "{$base}/{$path}";
    }

    private function normalizePath(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        $clean = trim($value);

        // If the value contains the host twice (e.g. "http://127...http://127.../file.png"), keep the last URL part.
        $httpPos = max(
            strrpos($clean, 'http://') !== false ? strrpos($clean, 'http://') : -1,
            strrpos($clean, 'https://') !== false ? strrpos($clean, 'https://') : -1,
        );
        if ($httpPos > 0) {
            $clean = substr($clean, $httpPos);
        }

        // If we have an absolute URL, strip the host and keep the path so we can rebuild with APP_URL.
        if (str_starts_with($clean, 'http')) {
            $path = parse_url($clean, PHP_URL_PATH) ?: '';
            $clean = $path ? ltrim($path, '/') : $clean;
        }

        $trimmed = ltrim($clean, '/');

        if (str_starts_with($trimmed, 'storage/')) {
            $path = $trimmed;
        } elseif (str_starts_with($trimmed, 'uploads/')) {
            $path = 'storage/' . $trimmed;
        } else {
            $path = 'storage/uploads/' . $trimmed;
        }

        return $path;
    }
}
