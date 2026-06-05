<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryRate extends Model
{
    /** @use HasFactory<\Database\Factories\DeliveryRateFactory> */
    use HasFactory;
     protected $guarded = []; // Asignación masiva permitida
}
