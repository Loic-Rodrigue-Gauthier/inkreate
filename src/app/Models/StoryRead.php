<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoryRead extends Model
{
    use HasFactory;

    protected $fillable = [
        'story_id',
        'user_id',
        'segment_id',
        'is_completed',
        'steps_read',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::created(function (StoryRead $read): void {
            $read->story()->increment('reading_count');
        });
    }

    public function story(): BelongsTo
    {
        return $this->belongsTo(Story::class);
    }

    public function segment(): BelongsTo
    {
        return $this->belongsTo(Segment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
