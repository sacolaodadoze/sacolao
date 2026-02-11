<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Entry extends Model
{
    protected $guarded = []; 
    /**
     * Obtener todos los pedidos asociados con esta entrada.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
