<?php

namespace App\Http\Controllers;

use App\Models\PaymentType;
use Illuminate\Http\Request;

class PaymentTypeController extends Controller
{
     public function index()
    {   
        $payment = PaymentType::all();     
        return response()->json($payment);
    }
}
