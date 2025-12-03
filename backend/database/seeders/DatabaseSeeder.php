<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->create([
            'username' => 'admin',
            'display_name' => 'Admin InKreate',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        $this->call(DemoContentSeeder::class);
    }
}
