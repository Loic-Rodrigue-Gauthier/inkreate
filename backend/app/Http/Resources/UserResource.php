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
            'avatar_url' => $this->absoluteUrl($this->avatar_url),
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
