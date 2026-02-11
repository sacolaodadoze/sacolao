<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Status;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $status = [
            ['id' => 1, 'name' => 'Criado'],
            ['id' => 2, 'name' => 'Em separação'],
            ['id' => 3, 'name' => 'Separado'],
            ['id' => 4, 'name' => 'Faturado'],
            ['id' => 5, 'name' => 'Em routa'],
            ['id' => 6, 'name' => 'Fechado'],
            ['id' => 7, 'name' => 'Pendente'],
        ];
        foreach ($status as $st) {
            Status::create($st);
        }
    }
}
