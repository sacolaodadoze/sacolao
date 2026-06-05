<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Setting;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all();
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $settings = Setting::firstOrCreate([]);
        $settings->update($request->all());

        return response()->json([
            'message' => 'Configurações atualizadas'
        ]);
    }
}
