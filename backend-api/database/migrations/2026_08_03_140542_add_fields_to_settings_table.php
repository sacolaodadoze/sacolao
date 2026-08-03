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
        Schema::table('settings', function (Blueprint $table) {
            $table->integer('delivery_morning')->nullable();
            $table->integer('delivery_afternoon')->nullable();
            $table->string('pickup_time')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn('delivery_morning');
            $table->dropColumn('delivery_afternoom');
            $table->dropColumn('pickup_time');
        });
    }
};
