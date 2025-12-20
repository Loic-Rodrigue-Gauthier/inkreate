<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\SegmentCommentResource;
use App\Models\Segment;
use App\Models\SegmentBookmark;
use App\Models\SegmentComment;
use App\Models\SegmentRating;
use App\Services\TextModerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SegmentEngagementController extends Controller
{
    public function rate(Request $request, Segment $segment): JsonResponse
    {
        $data = $request->validate([
            'score' => ['required', 'integer', 'min:1', 'max:5'],
            'feedback' => ['nullable', 'string', 'max:500'],
        ]);

        SegmentRating::updateOrCreate(
            [
                'segment_id' => $segment->id,
                'user_id' => $request->user()->id,
            ],
            [
                'score' => $data['score'],
                'feedback' => $data['feedback'] ?? null,
            ],
        );

        $segment->refresh();

        return response()->json([
            'message' => 'Merci pour la cote!',
            'rating' => [
                'average' => $segment->rating_average,
                'count' => $segment->rating_count,
            ],
        ]);
    }

    public function bookmark(Request $request, Segment $segment): JsonResponse
    {
        $data = $request->validate([
            'progress_percentage' => ['nullable', 'integer', 'min:0', 'max:100'],
        ]);

        SegmentBookmark::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'story_id' => $segment->story_id,
                'segment_id' => $segment->id,
            ],
            [
                'progress_percentage' => $data['progress_percentage'] ?? 0,
                'last_read_at' => now(),
            ],
        );

        return response()->json([
            'message' => 'Signet enregistré.',
        ], 201);
    }

    public function comment(Request $request, Segment $segment, TextModerator $moderator)
    {
        $data = $request->validate([
            'body' => ['required', 'string', 'max:800'],
        ]);

        $body = $moderator->filter($data['body']);

        $comment = $segment->comments()->create([
            'user_id' => $request->user()->id,
            'body' => $body['text'],
            'is_flagged' => $body['flagged'],
            'sentiment' => null,
        ]);

        return (new SegmentCommentResource($comment->load('user')))
            ->response()
            ->setStatusCode(201);
    }

    public function destroyComment(Request $request, Segment $segment, SegmentComment $comment): JsonResponse
    {
        abort_unless(
            $comment->user_id === $request->user()->id
            || $request->user()->id === $segment->story->owner_id,
            403,
        );

        abort_unless($comment->segment_id === $segment->id, 404);

        $comment->delete();

        return response()->json([
            'message' => 'Commentaire supprimé.',
        ]);
    }
}
