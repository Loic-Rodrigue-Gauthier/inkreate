<?php

namespace Database\Factories;

use App\Models\Segment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SegmentComment>
 */
class SegmentCommentFactory extends Factory
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
            'body' => fake()->sentences(2, true),
            'sentiment' => fake()->numberBetween(0, 100),
            'is_flagged' => false,
        ];
    }
}
