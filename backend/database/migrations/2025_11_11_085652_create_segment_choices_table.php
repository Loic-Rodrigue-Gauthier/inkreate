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
        Schema::create('segment_choices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('segment_id')->constrained('segments')->cascadeOnDelete();
            $table->string('label');
            $table->unsignedTinyInteger('position')->default(0);
            $table->boolean('is_locked')->default(false);
            $table->foreignId('next_segment_id')->nullable()->constrained('segments')->nullOnDelete();
            $table->timestamps();

            $table->unique(['segment_id', 'label']);
            $table->index(['segment_id', 'position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('segment_choices');
    }
};
