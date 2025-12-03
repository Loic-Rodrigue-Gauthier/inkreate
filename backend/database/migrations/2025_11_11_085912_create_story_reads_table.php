<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('story_reads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('story_id')->constrained('stories')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('segment_id')->nullable()->constrained('segments')->nullOnDelete();
            $table->boolean('is_completed')->default(false);
            $table->unsignedInteger('steps_read')->default(0);
            $table->timestamps();

            $table->index(['story_id', 'created_at']);
            $table->index(['user_id', 'story_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('story_reads');
    }
};
