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
            'cover_image_url' => $this->cover_image_url,
            'tags' => $this->tags ?? [],
            'content_warnings' => $this->content_warnings ?? [],
            'rating' => [
                'average' => (float) $this->rating_average,
                'count' => $this->rating_count,
            ],
            'metrics' => [
                'reads' => $this->reading_count,
                'favorites' => $this->favorites_count,
                'segments' => $this->segments_count,
            ],
            'published_at' => optional($this->published_at)?->toIso8601String(),
            'owner' => UserResource::make($this->whenLoaded('owner')),
            'root_segments' => SegmentResource::collection($this->whenLoaded('rootSegments')),
        ];
    }
}
