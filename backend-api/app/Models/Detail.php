<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Detail extends Model
{
    protected $guarded = []; // Asignación masiva permitida
    /**
     * Obtener el pedido asociado con este detalle.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }   
}
