<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_login(): void
    {
        $registerResponse = $this->postJson('/api/auth/register', [
            'username' => 'auteur-test',
            'display_name' => 'Auteur Test',
            'email' => 'auteur@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'preferred_genres' => ['fantasy'],
        ]);

        $registerResponse
            ->assertCreated()
            ->assertJsonStructure(['token', 'user' => ['id', 'username', 'role']]);

        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => 'auteur@example.com',
            'password' => 'password123',
        ]);

        $loginResponse
            ->assertOk()
            ->assertJsonStructure(['token', 'user' => ['id', 'username']]);
    }
}
