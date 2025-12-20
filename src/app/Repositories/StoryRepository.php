<?php

namespace App\Repositories;

use App\Models\Story;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StoryRepository
{
    public function paginate(array $filters, int $perPage = 12, bool $withRoot = false): LengthAwarePaginator
    {
        $query = Story::query()
            ->with('owner')
            ->withCount(['comments', 'reads'])
            ->filter($filters);

        if ($withRoot) {
            $query->with(['rootSegments' => fn ($root) => $root->with('choices')]);
        }

        return $query->paginate($perPage);
    }

    public function loadWithRootSegments(Story $story): Story
    {
        return $story
            ->load([
                'owner',
                'rootSegments' => fn ($query) => $query->with([
                    'choices.nextSegment',
                    'author',
                ]),
            ])
            ->loadCount('comments');
    }
}
