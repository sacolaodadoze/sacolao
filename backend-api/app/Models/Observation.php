<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Observation extends Model
{
    protected $guarded = []; // Asignación masiva permitida
    /**
     * Obtener el pedido asociado con esta observación.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
