<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('customer_code')->unique();
            $table->string('name');
            $table->bigInteger('document');
            $table->integer('customer_type')->default(1); // 1 - pessoa fisica, 2 - juridica ,3 - simplificada
            $table->timestamps();
        });

        DB::statement("COMMENT ON TABLE customers IS 'Clientes do sistema'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
