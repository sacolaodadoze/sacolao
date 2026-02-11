<?php

namespace Database\Seeders;

use App\Models\PaymentType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $type = [
            ['id' => 1, 'name' => 'Crediário'],
            ['id' => 2, 'name' => 'Cartão'],
            ['id' => 3, 'name' => 'Pix'],
            ['id' => 4, 'name' => 'Dinheiro'],


        ];
        foreach ($type as $t) {
            PaymentType::create($t);
        }
    }
}
