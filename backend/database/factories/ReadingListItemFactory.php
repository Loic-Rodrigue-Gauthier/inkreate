<?php

namespace Database\Factories;

use App\Models\Story;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ReadingListItem>
 */
class ReadingListItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'story_id' => Story::factory(),
            'status' => fake()->randomElement(['queued', 'reading', 'completed']),
            'priority' => fake()->numberBetween(0, 3),
            'started_at' => null,
            'completed_at' => null,
        ];
    }
}
