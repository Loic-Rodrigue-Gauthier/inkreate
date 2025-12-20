<?php

namespace Database\Factories;

use App\Models\Segment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SegmentChoice>
 */
class SegmentChoiceFactory extends Factory
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
            'label' => fake()->sentence(2),
            'position' => fake()->numberBetween(0, 3),
            'is_locked' => false,
            'next_segment_id' => null,
        ];
    }
}
