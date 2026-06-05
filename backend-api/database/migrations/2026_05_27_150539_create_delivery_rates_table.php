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
        Schema::create('delivery_rates', function (Blueprint $table) {
            $table->id();

            $table->decimal('min_distance', 5, 2);

            $table->decimal('max_distance', 5, 2)->nullable();

            $table->decimal('minimum_order', 10, 2)->default(0);

            $table->decimal('delivery_fee', 10, 2)->default(0);

            $table->boolean('free_delivery')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_rates');
    }
};
