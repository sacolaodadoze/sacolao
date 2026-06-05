<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       Setting::create([

            'business_name' => 'Sacolão da Doze',

            'phone' => '(14) 3322-2152',
            'secondary_phone' => '(14) 3335-6129',

            'whatsapp' => '14998242254',
            'whatsapp_url' => 'https://wa.me/14998242254',

            'instagram' => 'https://www.instagram.com/sacolaodadoze/',
            'facebook' => null,

            'address' => 'Rua Doze de Outubro, 630 - Vila Margarida',
            'city' => 'Ourinhos',
            'state' => 'SP',

            'google_maps_url' =>
                'https://www.google.com/maps?q=-22.9749716,-49.8767675&z=17&hl=pt-BR',

            // HORÁRIOS

            'weekday_open_morning' => '08:00',
            'weekday_close_morning' => '13:00',

            'weekday_open_afternoon' => '15:00',
            'weekday_close_afternoon' => '18:30',

            'saturday_open' => '08:00',
            'saturday_close' => '16:00',

            'sunday_open' => '08:00',
            'sunday_close' => '12:00',

            // HEADER INFO

            'info' =>
                'Compras no momento apenas pelo WhatsApp',

            // ENTREGA

            'delivery_time' =>
                '90-120 minutos',

            'free_rate' =>
                'Frete grátis acima de R$ 140',

            // STATUS

            'is_closed' => false,

            // WHATSAPP DEFAULT MESSAGE

            'whatsapp_default_message' =>
                'Olá! Gostaria de fazer um pedido 😊',
        ]);
    }
}
