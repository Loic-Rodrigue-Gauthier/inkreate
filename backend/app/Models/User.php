<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'display_name',
        'email',
        'role',
        'avatar_url',
        'timezone',
        'preferred_genres',
        'notification_settings',
        'bio',
        'stories_count',
        'segments_count',
        'followers_count',
        'following_count',
        'last_active_at',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_active_at' => 'datetime',
            'preferred_genres' => 'array',
            'notification_settings' => 'array',
            'password' => 'hashed',
        ];
    }

    public function stories(): HasMany
    {
        return $this->hasMany(Story::class, 'owner_id');
    }

    public function segments(): HasMany
    {
        return $this->hasMany(Segment::class, 'author_id');
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(StoryFavorite::class);
    }

    public function readingList(): HasMany
    {
        return $this->hasMany(ReadingListItem::class);
    }

    public function bookmarks(): HasMany
    {
        return $this->hasMany(SegmentBookmark::class);
    }

    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(
            self::class,
            'user_follows',
            'followed_id',
            'follower_id',
        );
    }

    public function following(): BelongsToMany
    {
        return $this->belongsToMany(
            self::class,
            'user_follows',
            'follower_id',
            'followed_id',
        );
    }

    public function chatThreads(): BelongsToMany
    {
        return $this->belongsToMany(ChatThread::class)
            ->withPivot(['role', 'last_read_at'])
            ->withTimestamps();
    }
}
