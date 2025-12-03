<?php

namespace Database\Factories;

use App\Models\ChatThread;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ChatMessage>
 */
class ChatMessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'thread_id' => ChatThread::factory(),
            'user_id' => User::factory(),
            'body' => fake()->sentence(),
            'attachments' => [],
            'is_system' => false,
        ];
    }
}
