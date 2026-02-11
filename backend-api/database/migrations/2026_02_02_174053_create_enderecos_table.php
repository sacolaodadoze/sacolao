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
       Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('customer_id')->constrained()->onDelete('cascade');;  
            $table->string('street');          // rua
            $table->string('number')->nullable();          // numero (se recomienda string por si hay 'S/N' o 'Km 5')
            $table->string('cep')->nullable();        // cep (usamos string porque los códigos postales no se suman)
            $table->string('neighborhood')->nullable();    // bairro
            $table->text('complement')->nullable(); // complemento
            $table->string('city')->nullable();            // cidade
            $table->string('state')->nullable();           // estado
            $table->integer('is_primary')->default(1); // 1 - principal, 2 - cobrança

            $table->timestamps();
        });

        DB::statement("COMMENT ON TABLE addresses IS 'Endereços dos clientes'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
