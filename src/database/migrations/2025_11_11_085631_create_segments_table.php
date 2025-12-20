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
        Schema::create('segments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('story_id')->constrained('stories')->cascadeOnDelete();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('parent_segment_id')->nullable()->constrained('segments')->nullOnDelete();
            $table->string('title')->nullable();
            $table->text('content');
            $table->string('image_url')->nullable();
            $table->boolean('is_public')->default(true);
            $table->boolean('is_terminal')->default(false);
            $table->unsignedSmallInteger('reading_time_minutes')->default(3);
            $table->unsignedInteger('sequence_order')->default(0);
            $table->decimal('rating_average', 3, 2)->default(0);
            $table->unsignedInteger('rating_count')->default(0);
            $table->json('prompt_context')->nullable();
            $table->json('moderation_flags')->nullable();
            $table->timestamps();

            $table->index(['story_id', 'parent_segment_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('segments');
    }
};
