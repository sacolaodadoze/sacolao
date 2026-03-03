<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Btty',
            'email' => 'btty@example.com',
            'password' => Hash::make('123'), // importante hashear la contraseña
            'role' => 'admin', // si usas roles
        ]);

        User::factory()->create([
            'name' => 'Mayara',
            'email' => 'mayara@example.com',
            'password' => Hash::make('456'),
            'role' => 'user',
        ]);
    }
}
