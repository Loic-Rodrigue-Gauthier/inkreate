<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'username' => ['required', 'alpha_dash', 'min:3', 'max:30', 'unique:users,username'],
            'display_name' => ['required', 'string', 'max:60'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'preferred_genres' => ['array'],
            'preferred_genres.*' => ['string', 'max:30'],
        ]);

        $user = User::create([
            'username' => Str::slug($data['username']),
            'display_name' => $data['display_name'],
            'email' => $data['email'],
            'role' => 'creator',
            'preferred_genres' => $data['preferred_genres'] ?? [],
            'notification_settings' => [
                'newFollower' => true,
                'storyUpdate' => true,
                'weeklyDigest' => true,
            ],
            'password' => $data['password'],
        ]);

        $token = $user->createToken('inkreate-api')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => new UserResource($user),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $token = $user->createToken('inkreate-api')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Déconnecté.',
        ]);
    }

    public function profile(Request $request): UserResource
    {
        return new UserResource($request->user()->loadCount(['stories', 'segments']));
    }
}
