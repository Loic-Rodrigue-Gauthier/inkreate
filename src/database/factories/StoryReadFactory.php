<?php

namespace Database\Factories;

use App\Models\Segment;
use App\Models\Story;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StoryRead>
 */
class StoryReadFactory extends Factory
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
            'user_id' => User::factory(),
            'segment_id' => Segment::factory(),
            'is_completed' => fake()->boolean(),
            'steps_read' => fake()->numberBetween(1, 20),
        ];
    }
}
