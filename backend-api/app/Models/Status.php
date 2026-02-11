<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Status extends Model
{
        protected $guarded = [];  
    /**
     * Obtener todos los pedidos asociados con este estado.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }   
}
