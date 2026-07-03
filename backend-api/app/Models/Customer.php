<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use  Illuminate\Database\Eloquent\Relations\HasOne;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;


//tiene varios pedidos
class Customer extends Authenticatable
{
    use HasApiTokens;
    //  protected $guarded = [];

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'street',
        'number',
        'district',
        'city',
    ];

   protected $hidden = ['password', 'remember_token'];
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
        return $this->hasMany(Phone::class)->orderBy('type', 'asc');//->where('type', 1);
    }

    /**
     * Obtener todos los enderecos nte.
     */
    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class)->orderBy('is_primary', 'asc');//->where('is_primary', 1);
    }

    /**
     * Obtener as observaçoes do pedido.
     */
    public function observation()
    {
        return $this->hasOne(Observation::class);
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
