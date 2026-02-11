<?php

namespace Database\Seeders;

use App\Models\Entry;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EntrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $entries = [
            ['id' => 1, 'name' => 'Whatsapp'],
            ['id' => 2, 'name' => 'Telefone'],
            ['id' => 3, 'name' => 'Cardápio
'],
          
        ];
        foreach ($entries as $entry) {
            Entry::create($entry);
        }
    }
}
