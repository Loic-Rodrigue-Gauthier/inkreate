<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SegmentCommentResource extends JsonResource
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
            'segment_id' => $this->segment_id,
            'body' => $this->body,
            'sentiment' => $this->sentiment,
            'is_flagged' => $this->is_flagged,
            'author' => UserResource::make($this->whenLoaded('user')),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
