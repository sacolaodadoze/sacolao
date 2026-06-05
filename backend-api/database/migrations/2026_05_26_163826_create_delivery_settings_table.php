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
        Schema::create('delivery_settings', function (Blueprint $table) {
            $table->id();
              // Horarios de entrega para dias de semana
            $table->string('weekday_delivery_open_morning')->nullable();
            $table->string('weekday_delivery_close_morning')->nullable();

            $table->string('weekday_delivery_open_afternoon')->nullable();
            $table->string('weekday_delivery_close_afternoon')->nullable();

            $table->string('saturday_open_delivery')->nullable();
            $table->string('saturday_close_delivery')->nullable();

            /* Settings */
             // mínimo  minutes despois do pedido
            $table->decimal('minimum_schedule_minutes')->default(90);

            // hora límite para agendar entrega no mesmo dia
            // ejemplo: 21:00
            $table->time('minimum_hour_to_schedule_same_day')->nullable();

            // janela de entrega
            // ejemplo: 60 minutos
            $table->integer('delivery_window_minutes')->default(60);

            // permitir entrega no mesmo dia
            $table->boolean('same_day_delivery')->default(true);

            // permitir entrega em feriados
            $table->boolean('allow_holiday_delivery')->default(false);

            // máximo de dias para agendamento
            // ejemplo: hasta 7 días
            $table->integer('max_schedule_days')->default(7);
           
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_settings');
    }
};
