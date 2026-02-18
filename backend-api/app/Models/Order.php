<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Order extends Model
{
    protected $guarded = []; // Asignación masiva permitida
    
    protected $casts = [
        'items' => 'array', // Esto convierte el JSON a Array automáticamente
    ];

    /**
     * Obtener el cliente al que pertenece el pedido.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Obtener el estado al que pertenece el pedido.
     */
    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }


    /**
     * Obtener la entrada asociada con el pedido.
     */
    public function entry(): BelongsTo
    {
        return $this->belongsTo(Entry::class);
    }

    /**
     * Obtener el pagamento asociado con el pedido.
     */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(PaymentType::class,'payment_types_id');
    }

  
    /**
     * Obtener el detalle asociado con el pedido.
     */
    public function detail()
    {
        return $this->hasOne(Detail::class);
    }

    /**
     * Obtener los detalles de la espera asociado con el pedido.
     */
    public function delay()
    {
        return $this->hasOne(Delay::class);
    }
}
