<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Rate;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;
use App\Models\Status;
use App\Models\PaymentType;
use App\Models\Entry;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $counter = 1;

        $today = now()->format('dm');

        return [
            'customer_id' => Customer::inRandomOrder()->value('id'),
            'status_id' => Status::inRandomOrder()->value('id'),
            'payment_types_id' => PaymentType::inRandomOrder()->value('id'),
            'entry_id' => Entry::inRandomOrder()->value('id'),
            'rate_id' => Rate::inRandomOrder()->value('id'),
            'created_by' => User::inRandomOrder()->value('id'),

            'items' => json_encode(
               $this->faker->randomDigitNotNull() . ' ' . $this->faker->word()               
            ),

            'paid' => $this->faker->boolean(),
            'pickup' => $this->faker->boolean(),

            'number' => "#{$today}_" . $counter++,
        ];
    }
}
