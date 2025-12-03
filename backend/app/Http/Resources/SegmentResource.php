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
            'image_url' => $this->image_url,
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
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
