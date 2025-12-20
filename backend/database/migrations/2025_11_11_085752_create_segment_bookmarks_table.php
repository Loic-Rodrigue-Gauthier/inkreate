<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('segment_bookmarks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('story_id')->constrained('stories')->cascadeOnDelete();
            $table->foreignId('segment_id')->constrained('segments')->cascadeOnDelete();
            $table->unsignedTinyInteger('progress_percentage')->default(0);
            $table->timestamp('last_read_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'story_id']);
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('segment_bookmarks');
    }
};
