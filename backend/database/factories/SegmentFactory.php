<?php

namespace Database\Factories;

use App\Models\Story;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Segment>
 */
class SegmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'story_id' => Story::factory(),
            'author_id' => User::factory(),
            'parent_segment_id' => null,
            'title' => fake()->optional()->sentence(),
            'content' => fake()->paragraphs(2, true),
            'image_url' => null,
            'is_public' => true,
            'is_terminal' => false,
            'reading_time_minutes' => fake()->numberBetween(2, 5),
            'sequence_order' => fake()->numberBetween(1, 20),
            'rating_average' => fake()->randomFloat(2, 0, 5),
            'rating_count' => fake()->numberBetween(0, 100),
            'prompt_context' => ['mood' => fake()->randomElement(['hopeful', 'dark'])],
            'moderation_flags' => [],
        ];
    }
}
