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
        Schema::table('delivery_rates', function (Blueprint $table) {
           /*  $table->decimal('delivery_fee', 10, 2)->default(0); // no cumple el minimo
            $table->decimal('delivery_fee_after_minimum', 10, 2)->default(0); //cumple el minimo 
             $table->dropColumn('free_delivery'); */
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('delivery_rates', function (Blueprint $table) {
            /* $table->dropColumn('delivery_fee');
            $table->dropColumn('delivery_fee_after_minimum'); */
           
        });
    }
};
