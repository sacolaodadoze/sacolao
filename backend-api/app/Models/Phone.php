<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Phone extends Model
{
    protected $guarded = [];
         /**
     * Obtener el cliente al que pertenece el telefono
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
