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
        Schema::create('segment_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('segment_id')->constrained('segments')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('body');
            $table->unsignedTinyInteger('sentiment')->nullable();
            $table->boolean('is_flagged')->default(false);
            $table->timestamps();

            $table->index(['segment_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('segment_comments');
    }
};
