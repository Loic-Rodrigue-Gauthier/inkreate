<?php

namespace Tests\Feature;

use App\Models\Segment;
use App\Models\Story;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SegmentEngagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_rate_and_bookmark_segment(): void
    {
        $user = User::factory()->create();
        $story = Story::factory()->create(['owner_id' => $user->id]);
        $segment = Segment::factory()->create([
            'story_id' => $story->id,
            'author_id' => $user->id,
        ]);

        Sanctum::actingAs($user);

        $rateResponse = $this->postJson("/api/segments/{$segment->id}/rate", [
            'score' => 5,
            'feedback' => 'Excellent embranchement!',
        ]);

        $rateResponse
            ->assertOk()
            ->assertJsonFragment(['average' => 5]);

        $bookmarkResponse = $this->postJson("/api/segments/{$segment->id}/bookmark", [
            'progress_percentage' => 50,
        ]);

        $bookmarkResponse->assertCreated();
    }

    public function test_user_can_comment_on_segment(): void
    {
        $user = User::factory()->create();
        $segment = Segment::factory()->create([
            'author_id' => $user->id,
        ]);

        Sanctum::actingAs($user);

        $commentResponse = $this->postJson("/api/segments/{$segment->id}/comments", [
            'body' => 'Ce passage est magique!',
        ]);

        $commentResponse
            ->assertCreated()
            ->assertJsonFragment(['body' => 'Ce passage est magique!']);
    }
}
