<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\EntryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EstadoController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentTypeController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\RateController;


/* Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum'); */

/* Route::get('/sanctum/csrf-cookie', function() {
    return response()->json(['message' => 'CSRF cookie set']);
}); */


// Forzamos el middleware 'web' para que Laravel lea las cookies y el CSRF
Route::middleware('web')->group(function () {
    Route::post('/login', [LoginController::class, 'login']);
});

// Estas se quedan igual
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/user', [LoginController::class, 'user']);
});

Route::middleware(['web', 'auth:sanctum'])->group(function () {

    //Obter todos os estados
    Route::get('/status', [StatusController::class, 'index']);

    //Importar CSV
    Route::post('/import', [App\Http\Controllers\ImportController::class, 'store']);

    //Obter orders
    Route::get('/orders', [OrderController::class, 'index']);

    //Obter tipo pagamento
    Route::get('/payments', [PaymentTypeController::class, 'index']);

    //Obter entradas
    Route::get('/entries', [EntryController::class, 'index']);

       //Obter taxas
    Route::get('/rates', [RateController::class, 'index']);

    //Obter clientes
    Route::get('/customers/search', [CustomerController::class, 'search']);

    //Add order
    Route::post('/orders', [OrderController::class, 'store']);

    //Del order
    Route::delete('/orders/{id}', [OrderController::class, 'destroy'])->middleware('admin');;
});
