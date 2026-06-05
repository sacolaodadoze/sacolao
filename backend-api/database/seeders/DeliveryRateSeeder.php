<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DeliveryRate;

class DeliveryRateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DeliveryRate::create([
            'min_distance' => 0,
            'max_distance' => 1.5,
            'minimum_order' => 60,
            'delivery_fee' => 0,
        ]);

        DeliveryRate::create([
            'min_distance' => 1.5,
            'max_distance' => 4,
            'minimum_order' => 80,
            'delivery_fee' => 0,
        ]);

        DeliveryRate::create([
            'min_distance' => 4,
            'max_distance' => 6,
            'minimum_order' => 140,
            'delivery_fee' => 0,
        ]);

        DeliveryRate::create([
            'min_distance' => 6,
            'max_distance' => null,
            'minimum_order' => 0,
            'delivery_fee' => 15,
        ]);
    }
}
