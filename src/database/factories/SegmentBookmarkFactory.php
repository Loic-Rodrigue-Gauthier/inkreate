<?php

namespace Database\Factories;

use App\Models\Segment;
use App\Models\Story;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SegmentBookmark>
 */
class SegmentBookmarkFactory extends Factory
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
            'segment_id' => Segment::factory(),
            'progress_percentage' => fake()->numberBetween(0, 100),
            'last_read_at' => now(),
        ];
    }
}
