<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatMessageResource extends JsonResource
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
            'thread_id' => $this->thread_id,
            'body' => $this->body,
            'attachments' => $this->attachments ?? [],
            'is_system' => $this->is_system,
            'author' => UserResource::make($this->whenLoaded('author')),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
