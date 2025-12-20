<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Story>
 */
class StoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);

        return [
            'owner_id' => User::factory(),
            'title' => $title,
            'slug' => Str::slug($title) . '-' . fake()->numberBetween(10, 9999),
            'genre' => fake()->randomElement(['fantasy', 'science-fiction', 'thriller', 'romance']),
            'synopsis' => fake()->paragraph(),
            'cover_image_url' => null,
            'status' => 'draft',
            'is_public' => true,
            'is_collaborative' => true,
            'allow_forks' => true,
            'min_age' => fake()->numberBetween(0, 16),
            'estimated_duration' => fake()->numberBetween(5, 45),
            'reading_count' => fake()->numberBetween(0, 1000),
            'favorites_count' => fake()->numberBetween(0, 200),
            'segments_count' => fake()->numberBetween(1, 200),
            'rating_average' => fake()->randomFloat(2, 0, 5),
            'rating_count' => fake()->numberBetween(0, 1000),
            'tags' => fake()->randomElements(['adventure', 'coop', 'noir', 'mystery'], 2),
            'content_warnings' => [],
            'metadata' => [
                'language' => 'fr',
                'mood' => fake()->randomElement(['bright', 'dark']),
            ],
            'published_at' => null,
        ];
    }
}
