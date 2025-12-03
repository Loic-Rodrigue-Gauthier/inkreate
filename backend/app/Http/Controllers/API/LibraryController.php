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
        $favorites = StoryFavorite::with('story.owner')
            ->where('user_id', $request->user()->id)
            ->latest('id')
            ->get()
            ->pluck('story')
            ->filter();

        return StoryResource::collection($favorites);
    }

    public function readLater(Request $request): AnonymousResourceCollection
    {
        $items = ReadingListItem::with('story.owner')
            ->where('user_id', $request->user()->id)
            ->latest('id')
            ->get()
            ->pluck('story')
            ->filter();

        return StoryResource::collection($items);
    }
}
