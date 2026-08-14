<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\OrderCapacity;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::first();
        $today    = now()->toDateString();
        $capacity = OrderCapacity::where('date', $today)->first();
        
        $settings->delivery_morning   = $capacity?->morning_slots   ?? 0;
        $settings->delivery_afternoon = $capacity?->afternoon_slots ?? 0;

        return response()->json($settings);
    }

    public function update(Request $request)
    {
        
        $settings = Setting::firstOrCreate([]);
        $settings->update($request->all());

        //$orderDate = $data['delivery_date'] ?? now()->toDateString(); //  fecha del pedido o hoy

        $capacity=OrderCapacity::updateOrCreate(
            ['date' => now()->toDateString()], // solo el día de hoy
            [
                'morning_slots'   => $request->delivery_morning,
                'afternoon_slots' => $request->delivery_afternoon,
            ]
        );
        
        // dd($capacity->toArray());
        return response()->json([
            'message' => 'Configurações atualizadas'
        ]);
    }
}
