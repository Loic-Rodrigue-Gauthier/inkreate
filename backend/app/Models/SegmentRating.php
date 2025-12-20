<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SegmentRating extends Model
{
    use HasFactory;

    protected $fillable = [
        'segment_id',
        'user_id',
        'score',
        'feedback',
    ];

    protected static function booted(): void
    {
        $recalculate = function (SegmentRating $rating): void {
            $segment = $rating->segment()->with('story')->first();

            if (! $segment) {
                return;
            }

            $segmentSummary = $segment->ratings()
                ->selectRaw('AVG(score) as avg_score, COUNT(*) as total')
                ->first();

            $segment->update([
                'rating_average' => round((float) ($segmentSummary->avg_score ?? 0), 2),
                'rating_count' => (int) ($segmentSummary->total ?? 0),
            ]);

            $storySummary = SegmentRating::query()
                ->whereHas('segment', fn ($query) => $query->where('story_id', $segment->story_id))
                ->selectRaw('AVG(score) as avg_score, COUNT(*) as total')
                ->first();

            if ($storySummary && $segment->story) {
                $segment->story->update([
                    'rating_average' => round((float) ($storySummary->avg_score ?? 0), 2),
                    'rating_count' => (int) ($storySummary->total ?? 0),
                ]);
            }
        };

        static::saved($recalculate);
        static::deleted($recalculate);
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
