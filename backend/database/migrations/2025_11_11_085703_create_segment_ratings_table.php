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
        Schema::create('segment_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('segment_id')->constrained('segments')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedTinyInteger('score');
            $table->text('feedback')->nullable();
            $table->timestamps();

            $table->unique(['segment_id', 'user_id']);
            $table->index(['user_id', 'segment_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('segment_ratings');
    }
};
