<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Factories\EstadoFactory;
use Database\Factories\OrderFactory;
use Database\Seeders\RateSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use PhpOffice\PhpSpreadsheet\Calculation\Financial\Securities\Rates;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //  User::factory(2)->create();

        /*  User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]); */

      /*  $this->call(UserSeeder::class);
 
        $this->call(StatusSeeder::class);
        $this->call(EntrySeeder::class);
        $this->call(PaymentTypeSeeder::class);*/
        $this->call(RateSeeder::class); 

         //OrderFactory::new()->count(50)->create();
    }
}
