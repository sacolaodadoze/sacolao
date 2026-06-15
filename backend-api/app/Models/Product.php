<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = [];
   protected $with = ['category']; //Siempre me va a cargar la categoria del producto

   public function category()
{
    return $this->belongsTo(Category::class);
}
}
