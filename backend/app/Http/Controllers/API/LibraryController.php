<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoryResource;
use App\Models\ReadingListItem;
use App\Models\StoryFavorite;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LibraryController extends Controller
{
    public function favorites(Request $request): AnonymousResourceCollection
    {
        $storyIds = StoryFavorite::where('user_id', $request->user()->id)
            ->latest('id')
            ->pluck('story_id');

        $favorites = \App\Models\Story::query()
            ->whereIn('id', $storyIds)
            ->with('owner')
            ->withCount('comments')
            ->get();

        return StoryResource::collection($favorites);
    }

    public function readLater(Request $request): AnonymousResourceCollection
    {
        $storyIds = ReadingListItem::where('user_id', $request->user()->id)
            ->latest('id')
            ->pluck('story_id');

        $items = \App\Models\Story::query()
            ->whereIn('id', $storyIds)
            ->with('owner')
            ->withCount('comments')
            ->get();

        return StoryResource::collection($items);
    }
}
