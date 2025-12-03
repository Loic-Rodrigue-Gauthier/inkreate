<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ChatController;
use App\Http\Controllers\API\FollowController;
use App\Http\Controllers\API\LibraryController;
use App\Http\Controllers\API\SegmentController;
use App\Http\Controllers\API\SegmentEngagementController;
use App\Http\Controllers\API\StoryController;
use App\Http\Controllers\API\StoryEngagementController;
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Route;

Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

Route::get('stories', [StoryController::class, 'index']);
Route::get('stories/{story}', [StoryController::class, 'show']);
Route::get('stories/{story}/segments', [SegmentController::class, 'index']);
Route::get('segments/{segment}', [SegmentController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('users', [UserController::class, 'index']);
    Route::put('auth/profile', [UserController::class, 'update']);
    Route::delete('auth/profile', [UserController::class, 'destroy']);

    Route::get('auth/profile', [AuthController::class, 'profile']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

    Route::post('stories', [StoryController::class, 'store']);
    Route::put('stories/{story}', [StoryController::class, 'update']);

    Route::post('stories/{story}/segments', [SegmentController::class, 'store']);
    Route::post('segments/{segment}/choices', [SegmentController::class, 'addChoice']);

    Route::post('stories/{story}/favorite', [StoryEngagementController::class, 'favorite']);
    Route::delete('stories/{story}/favorite', [StoryEngagementController::class, 'unfavorite']);
    Route::post('stories/{story}/read-later', [StoryEngagementController::class, 'markForLater']);
    Route::delete('stories/{story}/read-later', [StoryEngagementController::class, 'removeFromLater']);
    Route::get('stories/favorites', [LibraryController::class, 'favorites']);
    Route::get('stories/read-later', [LibraryController::class, 'readLater']);

    Route::post('segments/{segment}/rate', [SegmentEngagementController::class, 'rate']);
    Route::post('segments/{segment}/bookmark', [SegmentEngagementController::class, 'bookmark']);
    Route::post('segments/{segment}/comments', [SegmentEngagementController::class, 'comment']);
    Route::delete('segments/{segment}/comments/{comment}', [SegmentEngagementController::class, 'destroyComment']);

    Route::post('users/{user}/follow', [FollowController::class, 'follow']);
    Route::delete('users/{user}/follow', [FollowController::class, 'unfollow']);

    Route::get('chat/threads', [ChatController::class, 'index']);
    Route::post('chat/threads', [ChatController::class, 'store']);
    Route::get('chat/threads/{thread}', [ChatController::class, 'show']);
    Route::post('chat/threads/{thread}/messages', [ChatController::class, 'sendMessage']);
});
