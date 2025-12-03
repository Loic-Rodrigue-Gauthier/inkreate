<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'username' => $this->username,
            'display_name' => $this->display_name,
            'role' => $this->role,
            'avatar_url' => $this->avatar_url,
            'bio' => $this->bio,
            'timezone' => $this->timezone,
            'preferred_genres' => $this->preferred_genres ?? [],
            'stats' => [
                'stories' => $this->stories_count,
                'segments' => $this->segments_count,
                'followers' => $this->followers_count,
                'following' => $this->following_count,
            ],
            'last_active_at' => optional($this->last_active_at)?->toIso8601String(),
        ];
    }
}
