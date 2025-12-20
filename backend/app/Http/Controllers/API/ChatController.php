<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChatMessageResource;
use App\Http\Resources\ChatThreadResource;
use App\Models\ChatMessage;
use App\Models\ChatThread;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ChatController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $userId = $request->user()->id;

        $threads = ChatThread::query()
            ->whereHas('participants', fn ($query) => $query->where('user_id', $userId))
            ->with([
                'creator',
                'participants' => fn ($query) => $query->select(['users.id', 'username', 'display_name'])->limit(5),
                'messages' => fn ($query) => $query->latest()->limit(1)->with('author'),
            ])
            ->latest('updated_at')
            ->get()
            ->map(function (ChatThread $thread) use ($userId) {
                $lastRead = $thread->participants()->where('users.id', $userId)->first()?->pivot?->last_read_at;
                $thread->unread_count = $thread->messages()->where('created_at', '>', $lastRead ?? $thread->created_at)->count();
                return $thread;
            })
            ->sortByDesc('updated_at')
            ->values();

        return ChatThreadResource::collection($threads);
    }

    public function store(Request $request): ChatThreadResource
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:80'],
            'type' => ['required', 'in:direct,group'],
            'participant_ids' => ['array'],
            'participant_ids.*' => ['integer', 'exists:users,id'],
        ]);

        $thread = ChatThread::create([
            'creator_id' => $request->user()->id,
            'title' => $data['title'] ?? null,
            'type' => $data['type'],
            'is_archived' => false,
        ]);

        $participants = collect($data['participant_ids'] ?? [])
            ->push($request->user()->id)
            ->unique();

        $thread->participants()->sync($participants);

        return new ChatThreadResource($thread->load(['participants', 'creator']));
    }

    public function show(Request $request, ChatThread $thread): ChatThreadResource
    {
        abort_unless(
            $thread->participants()->where('user_id', $request->user()->id)->exists(),
            403,
        );

        $thread->load([
            'participants',
            'creator',
            'messages' => fn ($query) => $query->with('author')->latest()->limit(50)->orderBy('created_at'),
        ]);

        // Mark as read for this user
        $thread->participants()->updateExistingPivot($request->user()->id, ['last_read_at' => now()]);

        $lastRead = now();
        $thread->unread_count = $thread->messages()->where('created_at', '>', $lastRead)->count();

        return new ChatThreadResource($thread);
    }

    public function sendMessage(Request $request, ChatThread $thread): ChatMessageResource
    {
        $data = $request->validate([
            'body' => ['required', 'string', 'max:1000'],
        ]);

        $thread->participants()->syncWithoutDetaching([$request->user()->id]);

        $message = $thread->messages()->create([
            'user_id' => $request->user()->id,
            'body' => $data['body'],
            'attachments' => [],
        ]);

        return new ChatMessageResource($message->load('author'));
    }
}
