<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'username' => fake()->unique()->userName(),
            'display_name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'role' => fake()->randomElement(['reader', 'creator']),
            'avatar_url' => null,
            'timezone' => fake()->timezone(),
            'preferred_genres' => fake()->randomElements([
                'fantasy', 'science-fiction', 'mystery', 'romance', 'thriller',
            ], 2),
            'notification_settings' => [
                'newFollower' => true,
                'storyUpdate' => true,
                'weeklyDigest' => fake()->boolean(),
            ],
            'bio' => fake()->optional()->paragraph(),
            'stories_count' => 0,
            'segments_count' => 0,
            'followers_count' => 0,
            'following_count' => 0,
            'email_verified_at' => now(),
            'last_active_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
