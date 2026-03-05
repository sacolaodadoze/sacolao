<?php

namespace Database\Seeders;

use App\Models\Rate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rates = [
            ['id' => 1, 'rate' => 7],
            ['id' => 2, 'rate' => 10],
            ['id' => 3, 'rate' => 15],

        ];
        foreach ($rates as $rate) {
            Rate::create($rate);
        }
    }
}
