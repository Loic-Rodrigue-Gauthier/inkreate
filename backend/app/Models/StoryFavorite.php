<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoryFavorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'story_id',
        'user_id',
    ];

    protected static function booted(): void
    {
        static::created(function (StoryFavorite $favorite): void {
            $favorite->story()->increment('favorites_count');
        });

        static::deleted(function (StoryFavorite $favorite): void {
            $favorite->story()->decrement('favorites_count');
        });
    }

    public function story(): BelongsTo
    {
        return $this->belongsTo(Story::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
