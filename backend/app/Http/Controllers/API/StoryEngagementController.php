<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ReadingListItem;
use App\Models\Story;
use App\Models\StoryFavorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoryEngagementController extends Controller
{
    public function favorite(Request $request, Story $story): JsonResponse
    {
        StoryFavorite::firstOrCreate([
            'story_id' => $story->id,
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Histoire ajoutée aux favoris.',
            'favorites' => $story->refresh()->favorites_count,
        ], 201);
    }

    public function unfavorite(Request $request, Story $story): JsonResponse
    {
        StoryFavorite::where('story_id', $story->id)
            ->where('user_id', $request->user()->id)
            ->delete();

        return response()->json([
            'message' => 'Histoire retirée des favoris.',
            'favorites' => $story->refresh()->favorites_count,
        ]);
    }

    public function markForLater(Request $request, Story $story): JsonResponse
    {
        $data = $request->validate([
            'priority' => ['nullable', 'integer', 'min:0', 'max:5'],
        ]);

        ReadingListItem::updateOrCreate(
            [
                'story_id' => $story->id,
                'user_id' => $request->user()->id,
            ],
            [
                'status' => 'queued',
                'priority' => $data['priority'] ?? 0,
            ],
        );

        return response()->json([
            'message' => 'Histoire ajoutée à la liste À lire plus tard.',
        ], 201);
    }

    public function removeFromLater(Request $request, Story $story): JsonResponse
    {
        ReadingListItem::where('story_id', $story->id)
            ->where('user_id', $request->user()->id)
            ->delete();

        return response()->json([
            'message' => 'Histoire retirée de la liste À lire plus tard.',
        ]);
    }
}
