<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SegmentResource extends JsonResource
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
            'story_id' => $this->story_id,
            'parent_segment_id' => $this->parent_segment_id,
            'title' => $this->title,
            'content' => $this->content,
            'image_url' => $this->absoluteUrl($this->image_url),
            'is_public' => $this->is_public,
            'is_terminal' => $this->is_terminal,
            'reading_time_minutes' => $this->reading_time_minutes,
            'sequence_order' => $this->sequence_order,
            'rating' => [
                'average' => (float) $this->rating_average,
                'count' => $this->rating_count,
            ],
            'prompt_context' => $this->prompt_context ?? [],
            'moderation_flags' => $this->moderation_flags ?? [],
            'author' => UserResource::make($this->whenLoaded('author')),
            'choices' => SegmentChoiceResource::collection($this->whenLoaded('choices')),
            'comments' => SegmentCommentResource::collection($this->whenLoaded('comments')),
            'bookmarked' => $request->user()
                ? $this->bookmarks()->where('user_id', $request->user()->id)->exists()
                : false,
            'created_at' => $this->created_at->toIso8601String(),
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

        $httpPos = max(
            strrpos($clean, 'http://') !== false ? strrpos($clean, 'http://') : -1,
            strrpos($clean, 'https://') !== false ? strrpos($clean, 'https://') : -1,
        );
        if ($httpPos > 0) {
            $clean = substr($clean, $httpPos);
        }

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
