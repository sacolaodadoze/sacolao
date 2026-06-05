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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('business_name');

            $table->string('phone')->nullable();
            $table->string('secondary_phone')->nullable();

            $table->string('whatsapp')->nullable();
            $table->string('whatsapp_url')->nullable();

            $table->string('instagram')->nullable();
            $table->string('facebook')->nullable();

            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();

            $table->string('google_maps_url')->nullable();

            // HORÁRIOS

            $table->string('weekday_open_morning')->nullable();
            $table->string('weekday_close_morning')->nullable();

            $table->string('weekday_open_afternoon')->nullable();
            $table->string('weekday_close_afternoon')->nullable();

            $table->string('saturday_open')->nullable();
            $table->string('saturday_close')->nullable();

            $table->string('sunday_open')->nullable();
            $table->string('sunday_close')->nullable();

            $table->string('info')->nullable(); /* Info debajo del search */
            $table->string('delivery_time')->nullable();/* Tempo de entrega en minutos */
            $table->string('free_rate')->nullable();/* Taxa gratuita a partir de $R ... */

            $table->boolean('is_closed')->default(false);

            // WHATSAPP MESSAGE
            $table->text('whatsapp_default_message')->nullable();  /* mensaje automático para WhatsApp, saludo, promos... */

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
