<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserFollow;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    public function follow(Request $request, User $user): JsonResponse
    {
        abort_if($request->user()->id === $user->id, 422, 'Impossible de se suivre soi-même.');

        UserFollow::firstOrCreate([
            'follower_id' => $request->user()->id,
            'followed_id' => $user->id,
        ]);

        return response()->json([
            'message' => 'Vous suivez maintenant cet auteur.',
            'followers' => $user->refresh()->followers_count,
        ], 201);
    }

    public function unfollow(Request $request, User $user): JsonResponse
    {
        UserFollow::where('follower_id', $request->user()->id)
            ->where('followed_id', $user->id)
            ->delete();

        return response()->json([
            'message' => 'Vous ne suivez plus cet auteur.',
            'followers' => $user->refresh()->followers_count,
        ]);
    }
}
