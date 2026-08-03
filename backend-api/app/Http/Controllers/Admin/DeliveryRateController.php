<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\DeliveryRate;

class DeliveryRateController extends Controller
{
    public function index()
    {
        $rates = DeliveryRate::all();
        //dd($rates);
        return response()->json($rates);
    }

    public function update(Request $request)
    {
        /*  dd($request->all());
        $settings = \App\Models\DeliveryRate::firstOrCreate([]);
        $settings->update($request->all());


        return response()->json([
            'message' => 'Configurações atualizadas'
        ]); */
        /*  $validated = $request->validate([
            'rates' => 'required|array',

            'rates.*.min_distance' => 'required|numeric',

            'rates.*.max_distance' => 'required|numeric',

            'rates.*.minimum_order' => 'required|numeric',

            'rates.*.delivery_fee' => 'required|numeric',
        ]); */

        // BORRA TODO
        //DeliveryRate::truncate();
        DB::table('delivery_rates')->truncate();

        //Reseteo de la sequencia
       // DB::statement('ALTER SEQUENCE delivery_rates_id_seq RESTART WITH 1');

        // CREA TODO DE NUEVO
        foreach ($request['rates'] as $rate) {

            DeliveryRate::create([
                'min_distance' => $rate['min_distance'],
                'max_distance' => $rate['max_distance'],
                'minimum_order' => $rate['minimum_order'],
                'delivery_fee' => $rate['delivery_fee'],
                'delivery_fee_after_minimum'=>$rate['delivery_fee_after_minimum'],
            ]);
        }

        return response()->json([
            'message' => 'Taxas atualizadas'
        ]);
    }
}
