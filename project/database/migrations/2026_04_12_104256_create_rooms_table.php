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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_id')->unique()->comment('Unique identifier for the room, e.g., "101", "202A"');
            $table->decimal('price', 10, 2)->comment('Price per night for the room');
            $table->integer('initial_count')->comment('Initial number of rooms available');
            $table->integer('available_count')->comment('Current number of available rooms');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
