<?php

namespace Database\Seeders;

use App\Models\ChatMessage;
use App\Models\ChatThread;
use App\Models\ReadingListItem;
use App\Models\Segment;
use App\Models\SegmentChoice;
use App\Models\Story;
use App\Models\StoryFavorite;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoContentSeeder extends Seeder
{
    public function run(): void
    {
        // Users
        $alice = User::firstOrCreate(
            ['email' => 'alice@example.com'],
            [
                'username' => 'alice',
                'display_name' => 'Alice Writer',
                'role' => 'creator',
                'password' => Hash::make('password'),
                'preferred_genres' => ['fantasy', 'romance'],
                'bio' => 'Passionate about fantasy and romance. Loves collaborative stories.',
                'stories_count' => 0,
            ]
        );

        $bob = User::firstOrCreate(
            ['email' => 'bob@example.com'],
            [
                'username' => 'bob',
                'display_name' => 'Bob Storyteller',
                'role' => 'creator',
                'password' => Hash::make('password'),
                'preferred_genres' => ['mystery', 'thriller'],
                'bio' => 'Thriller and mystery enthusiast.',
                'stories_count' => 0,
            ]
        );

        $jane = User::firstOrCreate(
            ['email' => 'jane@example.com'],
            [
                'username' => 'jane',
                'display_name' => 'Jane Collaborator',
                'role' => 'creator',
                'password' => Hash::make('password'),
                'preferred_genres' => ['science fiction', 'adventure'],
                'bio' => 'Exploring sci-fi worlds with collaborators.',
                'stories_count' => 0,
            ]
        );

        $charlie = User::firstOrCreate(
            ['email' => 'charlie@example.com'],
            [
                'username' => 'charlie',
                'display_name' => 'Charlie Explorer',
                'role' => 'creator',
                'password' => Hash::make('password'),
                'preferred_genres' => ['adventure', 'sci-fi'],
                'bio' => 'Adventure junkie and space dreamer.',
            ]
        );

        $dana = User::firstOrCreate(
            ['email' => 'dana@example.com'],
            [
                'username' => 'dana',
                'display_name' => 'Dana Poet',
                'role' => 'creator',
                'password' => Hash::make('password'),
                'preferred_genres' => ['drama', 'poetry'],
                'bio' => 'Words, rhythms, and quiet stories.',
            ]
        );

        $emma = User::firstOrCreate(
            ['email' => 'emma@example.com'],
            [
                'username' => 'emma',
                'display_name' => 'Emma Futurist',
                'role' => 'creator',
                'password' => Hash::make('password'),
                'preferred_genres' => ['sci-fi', 'cyberpunk'],
                'bio' => 'Exploring neon cities and AI tales.',
            ]
        );

        // Stories + segments
        $storiesData = [
            [
                'owner' => $alice,
                'title' => 'The Chronicles of Ethereal Realms',
                'genre' => 'Fantasy',
                'synopsis' => 'A magical fantasy adventure spanning multiple dimensions where heroes must unite to save all realities.',
                'tags' => ['fantasy', 'adventure', 'collaboration'],
                'reading_count' => 1250,
                'favorites_count' => 12,
                'segments' => [
                    [
                        'title' => 'Gateway of Light',
                        'content' => 'In the twilight between worlds, the crystalline archway hummed with ethereal energy...',
                        'choices' => ['Enter the portal', 'Study the inscriptions'],
                    ],
                    [
                        'title' => 'Crossing Over',
                        'content' => 'Stepping through, the heroes found themselves suspended between shimmering islands...',
                        'choices' => ['Seek the Oracle', 'Rest at the sky-island'],
                    ],
                ],
            ],
            [
                'owner' => $bob,
                'title' => 'Hearts in the Digital Age',
                'genre' => 'Romance',
                'synopsis' => 'A contemporary romance exploring love, technology, and human connection in our modern world.',
                'tags' => ['romance', 'technology', 'contemporary'],
                'reading_count' => 980,
                'favorites_count' => 8,
                'segments' => [
                    [
                        'title' => 'The First Ping',
                        'content' => 'A glitch in the messaging app made two strangers meet unexpectedly.',
                        'choices' => ['Reply with curiosity', 'Ignore the glitch'],
                    ],
                ],
            ],
            [
                'owner' => $jane,
                'title' => 'Mystery at Moonlight Manor',
                'genre' => 'Mystery',
                'synopsis' => 'A thrilling mystery where guests at a Victorian manor must solve a series of puzzling disappearances.',
                'tags' => ['mystery', 'victorian', 'suspense'],
                'reading_count' => 1500,
                'favorites_count' => 15,
                'segments' => [
                    [
                        'title' => 'Invitation',
                        'content' => 'The guests arrived at Moonlight Manor, unaware of the secrets hidden within.',
                        'choices' => ['Explore the library', 'Inspect the garden'],
                    ],
                ],
            ],
            [
                'owner' => $charlie,
                'title' => 'Voyagers of the Azure Rift',
                'genre' => 'Science Fiction',
                'synopsis' => 'A crew crosses a dimensional rift to chart unknown galaxies.',
                'tags' => ['sci-fi', 'adventure', 'exploration'],
                'reading_count' => 720,
                'favorites_count' => 6,
                'segments' => [
                    [
                        'title' => 'Launch Day',
                        'content' => 'Engines roared as the Azure lifted off, slicing through clouds.',
                        'choices' => ['Engage warp', 'Run systems check'],
                    ],
                    [
                        'title' => 'The Rift',
                        'content' => 'The rift shimmered like liquid glass, pulling the ship forward.',
                        'choices' => ['Analyze energy', 'Send probe'],
                    ],
                ],
            ],
            [
                'owner' => $dana,
                'title' => 'Whispers in the Courtyard',
                'genre' => 'Drama',
                'synopsis' => 'Interwoven stories of neighbors in an old stone courtyard.',
                'tags' => ['drama', 'slice-of-life', 'poetic'],
                'reading_count' => 410,
                'favorites_count' => 5,
                'segments' => [
                    [
                        'title' => 'Morning Light',
                        'content' => 'Sunlight dripped over cobblestones; secrets waited behind shutters.',
                        'choices' => ['Knock on the baker’s door', 'Sit by the fountain'],
                    ],
                ],
            ],
            [
                'owner' => $emma,
                'title' => 'Neon Echoes',
                'genre' => 'Cyberpunk',
                'synopsis' => 'A hacker uncovers an AI whisper network beneath a neon megacity.',
                'tags' => ['cyberpunk', 'thriller', 'ai'],
                'reading_count' => 860,
                'favorites_count' => 9,
                'segments' => [
                    [
                        'title' => 'Signal',
                        'content' => 'The message arrived in static: “find the Echo before midnight.”',
                        'choices' => ['Trace the signal', 'Call a fixer'],
                    ],
                ],
            ],
        ];

        foreach ($storiesData as $data) {
            $story = Story::create([
                'owner_id' => $data['owner']->id,
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'genre' => $data['genre'],
                'synopsis' => $data['synopsis'],
                'status' => 'published',
                'is_public' => true,
                'is_collaborative' => true,
                'allow_forks' => true,
                'reading_count' => $data['reading_count'],
                'favorites_count' => $data['favorites_count'],
                'segments_count' => 0,
                'tags' => $data['tags'],
                'rating_average' => 4.5,
                'rating_count' => 20,
            ]);

            foreach ($data['segments'] as $index => $seg) {
                $segment = Segment::create([
                    'story_id' => $story->id,
                    'author_id' => $data['owner']->id,
                    'parent_segment_id' => null,
                    'title' => $seg['title'],
                    'content' => $seg['content'],
                    'image_url' => null,
                    'is_public' => true,
                    'is_terminal' => false,
                    'reading_time_minutes' => 3,
                    'sequence_order' => $index + 1,
                ]);
                $story->increment('segments_count');

                foreach ($seg['choices'] as $pos => $choiceLabel) {
                    SegmentChoice::create([
                        'segment_id' => $segment->id,
                        'label' => $choiceLabel,
                        'position' => $pos,
                        'is_locked' => false,
                        'next_segment_id' => null,
                    ]);
                }
            }
        }

        // Favorites / Read later
        StoryFavorite::firstOrCreate(['story_id' => 1, 'user_id' => $bob->id]);
        StoryFavorite::firstOrCreate(['story_id' => 1, 'user_id' => $jane->id]);
        ReadingListItem::updateOrCreate(['story_id' => 2, 'user_id' => $alice->id], ['status' => 'queued', 'priority' => 1]);
        ReadingListItem::updateOrCreate(['story_id' => 3, 'user_id' => $bob->id], ['status' => 'queued', 'priority' => 2]);
        StoryFavorite::firstOrCreate(['story_id' => 4, 'user_id' => $emma->id]);
        ReadingListItem::updateOrCreate(['story_id' => 5, 'user_id' => $dana->id], ['status' => 'queued', 'priority' => 1]);

        // Chat threads + messages
        $thread = ChatThread::create([
            'creator_id' => $alice->id,
            'title' => 'Collab Ideas',
            'type' => 'group',
            'is_archived' => false,
        ]);
        DB::table('chat_thread_user')->insert([
            ['thread_id' => $thread->id, 'user_id' => $alice->id, 'role' => 'member'],
            ['thread_id' => $thread->id, 'user_id' => $bob->id, 'role' => 'member'],
            ['thread_id' => $thread->id, 'user_id' => $jane->id, 'role' => 'member'],
        ]);

        ChatMessage::create([
            'thread_id' => $thread->id,
            'user_id' => $alice->id,
            'body' => 'Hey team! Ready to draft the next segment?',
            'attachments' => [],
        ]);

        ChatMessage::create([
            'thread_id' => $thread->id,
            'user_id' => $bob->id,
            'body' => 'Yes! I have some ideas for the twist.',
            'attachments' => [],
        ]);
    }
}
