<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\DeliverySetting;

class DeliverySettingController extends Controller
{
   public function index()
    {
        $deliverySettings = DeliverySetting::all();     
        return response()->json($deliverySettings);       
    }

    public function update(Request $request)
    {
        $settings = DeliverySetting::firstOrCreate([]);
        $settings->update($request->all());

        return response()->json([
            'message' => 'Configurações atualizadas'
        ]);
    }
}
