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
        Schema::create('order_capacities', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique();          // un registro por día
            $table->integer('morning_slots');        // cupos disponibles mañana
            $table->integer('afternoon_slots');      // cupos disponibles tarde
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_capacities');
    }
};
