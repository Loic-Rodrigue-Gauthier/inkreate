<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $search = $request->string('search')->toString();

        $users = $request->user()
            ->newQuery()
            ->when($search, function ($query) use ($search) {
                $term = "%{$search}%";

                return $query->where(fn ($q) => $q
                    ->where('username', 'like', $term)
                    ->orWhere('display_name', 'like', $term)
                    ->orWhere('email', 'like', $term));
            })
            ->orderBy('username')
            ->limit(20)
            ->get(['id', 'username', 'display_name', 'avatar_url']);

        return UserResource::collection($users);
    }

    public function update(Request $request): UserResource
    {
        $data = $request->validate([
            'display_name' => ['sometimes', 'string', 'max:120'],
            'avatar_url' => ['sometimes', 'nullable', 'string', 'max:2048'],
            'bio' => ['sometimes', 'nullable', 'string', 'max:500'],
            'preferred_genres' => ['sometimes', 'array'],
            'preferred_genres.*' => ['string', 'max:30'],
            'notification_settings' => ['sometimes', 'array'],
            'timezone' => ['sometimes', 'string', 'max:64'],
            'language' => ['sometimes', 'nullable', 'string', 'max:10'],
        ]);

        $request->user()->fill($data)->save();

        return new UserResource($request->user());
    }

    public function destroy(Request $request): JsonResponse
    {
        $user = $request->user();
        $user?->tokens()->delete();
        $user?->delete();

        return response()->json(['message' => 'Account deleted.']);
    }
}
