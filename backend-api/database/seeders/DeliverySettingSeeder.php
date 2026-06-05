<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DeliverySetting;

class DeliverySettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DeliverySetting::create([

            /*
            |--------------------------------------------------------------------------
            | HORÁRIOS DE ENTREGA
            |--------------------------------------------------------------------------
            */

            // Segunda a sexta - manhã
            'weekday_delivery_open_morning' => '09:00',
            'weekday_delivery_close_morning' => '12:30',

            // Segunda a sexta - tarde
            'weekday_delivery_open_afternoon' => '15:30',
            'weekday_delivery_close_afternoon' => '17:30',

            // Sábado
            'saturday_open_delivery' => '09:00',
            'saturday_close_delivery' => '12:30',

            /*
            |--------------------------------------------------------------------------
            | CONFIGURAÇÕES DE AGENDAMENTO
            |--------------------------------------------------------------------------
            */

            // mínimo 90 minutos depois do pedido
            'minimum_schedule_minutes' => 90,

            // última hora para agendar no mesmo dia
            'minimum_hour_to_schedule_same_day' => '21:00:00',

            // janela de entrega
            'delivery_window_minutes' => 90,

            // permitir entrega no mesmo dia
            'same_day_delivery' => true,

            // permitir entrega em feriados
            'allow_holiday_delivery' => false,

            // máximo de dias para agendar
            'max_schedule_days' => 7,

        ]);
    }
}
