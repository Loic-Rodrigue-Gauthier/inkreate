<?php

namespace App\Repositories;

use App\Models\Segment;
use App\Models\Story;
use Illuminate\Support\Collection;

class SegmentRepository
{
    public function listForStory(Story $story, ?int $parentSegmentId = null): Collection
    {
        return $story->segments()
            ->when(
                $parentSegmentId,
                fn ($query) => $query->where('parent_segment_id', $parentSegmentId),
                fn ($query) => $query->whereNull('parent_segment_id'),
            )
            ->with(['choices.nextSegment', 'author'])
            ->orderBy('sequence_order')
            ->get();
    }

    public function listForChoice(Story $story, int $choiceId): Collection
    {
        return $story->segments()
            ->where('parent_choice_id', $choiceId)
            ->with(['choices.nextSegment', 'author'])
            ->orderBy('sequence_order')
            ->get();
    }

    public function loadFull(Segment $segment): Segment
    {
        return $segment->load([
            'story:id,title,slug',
            'choices.nextSegment',
            'author',
            'comments.user',
        ]);
    }
}
