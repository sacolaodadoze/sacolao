<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Status;
use App\Models\PaymentType;
use App\Models\Entry;

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
        // Obtén el rango de IDs válidos para tus nomencladores
        // Asume que los IDs van de 1 al total de registros que sembraste
        $customer_id = Customer::pluck('id')->toArray();
        $statusIds = Status::pluck('id')->toArray();
        $paymentTypeIds = PaymentType::pluck('id')->toArray();
        $entryIds = Entry::pluck('id')->toArray();

        return [       
          
           'customer_id' => $this->faker->randomElement($customer_id),
            
            // Genera un JSON falso de items (ej: 3 productos con cantidad)
            'items' => json_encode([
                ['product' => $this->faker->word(), 'qty' => $this->faker->randomDigitNotNull()],
                ['product' => $this->faker->word(), 'qty' => $this->faker->randomDigitNotNull()],
            ]),
            
            'paid' => $this->faker->boolean(),
            'pickup' => $this->faker->boolean(),
            //'scheduled' => $this->faker->time(), // Genera una hora aleatoria
            
            // Relaciones con nomencladores
           // Asigna un ID aleatorio del array que creamos:
            'status_id' => $this->faker->randomElement($statusIds),
            'payment_types_id' => $this->faker->randomElement($paymentTypeIds),
            'entry_id' => $this->faker->randomElement($entryIds),
        ];
    }
}
