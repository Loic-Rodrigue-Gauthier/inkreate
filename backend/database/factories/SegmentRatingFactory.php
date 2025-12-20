<?php

namespace Database\Factories;

use App\Models\Segment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SegmentRating>
 */
class SegmentRatingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'segment_id' => Segment::factory(),
            'user_id' => User::factory(),
            'score' => fake()->numberBetween(1, 5),
            'feedback' => fake()->optional()->sentence(),
        ];
    }
}
