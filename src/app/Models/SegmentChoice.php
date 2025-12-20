<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SegmentChoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'segment_id',
        'label',
        'position',
        'is_locked',
        'next_segment_id',
    ];

    protected $casts = [
        'is_locked' => 'boolean',
    ];

    public function segment(): BelongsTo
    {
        return $this->belongsTo(Segment::class);
    }

    public function nextSegment(): BelongsTo
    {
        return $this->belongsTo(Segment::class, 'next_segment_id');
    }
}
