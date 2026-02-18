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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('restrict');
            $table->text('items'); //listagem de itens 
            $table->boolean('paid')->default(false); //pagado
            $table->boolean('pickup')->default(false); //recogida
            $table->time('scheduled')->nullable(); //agendado
            $table->foreignId('status_id')->constrained(); //id del estado  ,1-Criado                
            $table->foreignId('payment_types_id')->constrained();  // id tipo de pagamento
             $table->foreignId('entry_id')->constrained(); // id del tipo de entrada
            $table->timestamps();
        });
        DB::statement("COMMENT ON TABLE orders IS 'Pedidos do sistema'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
