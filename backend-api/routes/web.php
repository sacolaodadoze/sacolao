<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/{any}', function () {
    //return view('app');
     return response()->json(['message' => 'API funcionando']);
})->where('any', '.*');




