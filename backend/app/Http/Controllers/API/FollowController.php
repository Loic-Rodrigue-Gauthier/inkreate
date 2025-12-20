<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserFollow;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

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
        $follow = UserFollow::where('follower_id', $request->user()->id)
            ->where('followed_id', $user->id)
            ->first();

        $follow?->delete();

        return response()->json([
            'message' => 'Vous ne suivez plus cet auteur.',
            'followers' => $user->refresh()->followers_count,
        ]);
    }

    public function followers(User $user): AnonymousResourceCollection
    {
        $followers = $user->followers()->select(['users.id', 'username', 'display_name', 'avatar_url', 'followers_count', 'following_count'])->get();

        return UserResource::collection($followers);
    }

    public function following(User $user): AnonymousResourceCollection
    {
        $following = $user->following()->select(['users.id', 'username', 'display_name', 'avatar_url', 'followers_count', 'following_count'])->get();

        return UserResource::collection($following);
    }

    public function isFollowing(Request $request, User $user): JsonResponse
    {
        $isFollowing = UserFollow::where('follower_id', $request->user()->id)
            ->where('followed_id', $user->id)
            ->exists();

        return response()->json(['following' => $isFollowing]);
    }
}
