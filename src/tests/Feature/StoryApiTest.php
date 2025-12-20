<?php

namespace Tests\Feature;

use App\Models\Story;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_story_creation_and_listing_flow(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $createResponse = $this->postJson('/api/stories', [
            'title' => 'La Légende des Trois Mondes',
            'synopsis' => 'Une épopée interactive.',
            'genre' => 'fantasy',
            'tags' => ['aventure', 'coop'],
            'estimated_duration' => 15,
        ]);

        $createResponse->assertCreated();

        $storyId = $createResponse->json('data.id');

        $listResponse = $this->getJson('/api/stories?genre=fantasy&sort=popular');
        $listResponse
            ->assertOk()
            ->assertJsonFragment(['genre' => 'fantasy']);

        $showResponse = $this->getJson("/api/stories/{$storyId}");
        $showResponse
            ->assertOk()
            ->assertJsonFragment(['title' => 'La Légende des Trois Mondes']);
    }
}
