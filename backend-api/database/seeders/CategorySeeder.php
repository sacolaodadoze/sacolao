<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       Category::insert([
    [
        'name' => 'Frutas',
        'slug' => 'frutas',
        'position' => 2,
    ],
    [
        'name' => 'Prontos para consumo',
        'slug' => 'prontos-para-consumo',
        'position' => 1,
    ],
    [
        'name' => 'Legumes e ovos',
        'slug' => 'legumes-e-ovos',
        'position' => 3,
    ],
    [
        'name' => 'Hortaliças',
        'slug' => 'hortalicas',
        'position' => 4,
    ],
]);
    }
}
