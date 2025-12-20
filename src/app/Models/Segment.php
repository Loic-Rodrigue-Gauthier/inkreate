<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Segment extends Model
{
    use HasFactory;

    protected $fillable = [
        'story_id',
        'author_id',
        'parent_segment_id',
        'title',
        'content',
        'image_url',
        'is_public',
        'is_terminal',
        'reading_time_minutes',
        'sequence_order',
        'rating_average',
        'rating_count',
        'prompt_context',
        'moderation_flags',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'is_terminal' => 'boolean',
        'prompt_context' => 'array',
        'moderation_flags' => 'array',
    ];

    protected static function booted(): void
    {
        static::created(function (Segment $segment): void {
            $segment->story()->increment('segments_count');
            $segment->author()->increment('segments_count');
        });

        static::deleted(function (Segment $segment): void {
            $segment->story()->decrement('segments_count');
            $segment->author()->decrement('segments_count');
        });
    }

    public function story(): BelongsTo
    {
        return $this->belongsTo(Story::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function parentSegment(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_segment_id');
    }

    public function childSegments(): HasMany
    {
        return $this->hasMany(self::class, 'parent_segment_id');
    }

    public function choices(): HasMany
    {
        return $this->hasMany(SegmentChoice::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(SegmentRating::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(SegmentComment::class);
    }

    public function bookmarks(): HasMany
    {
        return $this->hasMany(SegmentBookmark::class);
    }
}
