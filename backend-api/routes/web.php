<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\PdfController;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/customer/pdf', [PdfController::class, 'show']);

Route::get('/{any}', function () {
    //return view('app');
    return response()->json(['message' => 'API funcionando']);
})->where('any', '.*');



