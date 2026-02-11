<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


//tiene varios pedidos
class Customer extends Model
{
    protected $guarded = [];
    /**
     * Obtener todos los pedidos del cliente.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }


    /**
     * Obtener todos los telefonos del cliente.
     */
    public function phones(): HasMany
    {
        return $this->hasMany(Phone::class);
    }

    /**
     * Obtener todos los enderecos nte.
     */
    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    /**
     *Pesquisar por nome y cpf
     *
     * @param [type] $query
     * @param [type] $search
     * @return void
     */
    public function scopeSearch($query, $search)
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('name', 'ILIKE', "%{$search}%")
                ->orWhere('document', 'ILIKE', "%{$search}%");
        });

        /*  POr si mudo de BD
         if (empty($search)) return $query;

    $search = strtolower($search);

    return $query->where(function ($q) use ($search) {
        $q->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
          ->orWhereRaw('LOWER(documento) LIKE ?', ["%{$search}%"]);
    }); */
    }
}
