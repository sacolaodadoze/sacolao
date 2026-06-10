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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('category_id');
            $table->string('name');

            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable(); //promoçoes


            // Venta por unidad          
            $table->decimal('price_per_unit', 10, 2)->nullable();
            $table->decimal('promo_price_per_unit', 10, 2)->nullable();

            // Venta por peso          
            $table->decimal('price_per_kg', 10, 2)->nullable();
            $table->decimal('promo_price_per_kg', 10, 2)->nullable();

            $table->decimal('average_weight', 8, 3)->nullable(); // peso medio

            $table->string('unit'); // kg, un, bandeja, maço...
            $table->integer('stock')->default(0);
            $table->string('image')->nullable();
            $table->boolean('active')->default(true);

            $table->boolean('featured')->default(false); // producto destacado, mas vendido, etc
            $table->boolean('promotion')->default(false);
            $table->boolean('new_product')->default(false);//novidades
            $table->boolean('week_offer')->default(false);//oferta da semana

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
