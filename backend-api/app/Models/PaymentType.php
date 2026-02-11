<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentType extends Model
{
    /**
     * Obtener todos los pedidos asociados con este pagamento.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }   
}
