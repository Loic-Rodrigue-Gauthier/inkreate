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
        Schema::create('stories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('genre')->index();
            $table->text('synopsis')->nullable();
            $table->string('cover_image_url')->nullable();
            $table->enum('status', ['draft', 'published', 'completed', 'archived'])->default('draft')->index();
            $table->boolean('is_public')->default(true);
            $table->boolean('is_collaborative')->default(true);
            $table->boolean('allow_forks')->default(true);
            $table->unsignedSmallInteger('min_age')->default(0);
            $table->unsignedInteger('estimated_duration')->default(5);
            $table->unsignedInteger('reading_count')->default(0);
            $table->unsignedInteger('favorites_count')->default(0);
            $table->unsignedInteger('segments_count')->default(0);
            $table->decimal('rating_average', 3, 2)->default(0);
            $table->unsignedInteger('rating_count')->default(0);
            $table->json('tags')->nullable();
            $table->json('content_warnings')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('published_at')->nullable()->index();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stories');
    }
};
