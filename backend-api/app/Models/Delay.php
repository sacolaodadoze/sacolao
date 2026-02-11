<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Delay extends Model
{
    /**
     * Obtener el pedido asociado con esta espera.
     */
    public function order(): HasOne
    {
        return $this->hasOne(Order::class);
    }   
}
