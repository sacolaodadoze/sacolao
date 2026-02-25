<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Order extends Model
{
    // Asignación masiva permitida
    protected $guarded = [];

    // Convierte el JSON a Array automáticamente
    protected $casts = [
        'items' => 'array',
    ];

    /**
     * Criar o numero do pedido     
     *
     * @return void
     */

  protected static function booted()
{
    static::creating(function ($order) {

        $today = Carbon::now()->format('dm');

        $countToday = self::whereDate('created_at', Carbon::today())->count();

        $order->number = "#{$today}_" . ($countToday + 1);
    });
}

    /**
     * Obtener el cliente al que pertenece el pedido.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
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
        return $this->belongsTo(PaymentType::class, 'payment_types_id');
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
