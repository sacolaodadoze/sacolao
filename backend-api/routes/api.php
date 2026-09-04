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
use App\Http\Controllers\Auth\CustomerAuthController;
use App\Http\Controllers\External\ExtCustomerController;
use App\Http\Controllers\RateController;
use App\Http\Controllers\External\GeocodingController;
use App\Http\Controllers\External\VuuptController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\DeliverySettingController;
use App\Http\Controllers\Admin\DeliveryRateController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\StoreController;


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

    //Obter order por id
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    //Del order
    Route::delete('/orders/{id}', [OrderController::class, 'destroy'])->middleware('admin');

    //VUUPT
    Route::get('/data', [VuuptController::class, 'getData']);
    Route::post('/insert', [VuuptController::class, 'store']);
    Route::post('/vuupt/customers', [VuuptController::class, 'storeCustomer']);
    Route::put('/vuupt/customers/{id}', [VuuptController::class, 'updateCustomer']);

    //Services addCustomer
    Route::get('/address/{cep}', [ExtCustomerController::class, 'address']);
    Route::get('/states', [ExtCustomerController::class, 'states']);
    Route::get('/cities/{uf}', [ExtCustomerController::class, 'cities']);

    //Add customer
    Route::post('/customers/', [CustomerController::class, 'store']);

    //PDF   
    Route::get('/customer/pdfs', [PdfController::class, 'list']);
    // Route::get('/customer/pdf', [PdfController::class, 'show']); //esta en web
    Route::delete('/customer/pdf', [PdfController::class, 'delete']);

    //Settings
    Route::get('/settings', [SettingController::class, 'index']);
    Route::put('/settings', [SettingController::class, 'update']);

    //Delivery Settings
    Route::get('/delivery-settings', [DeliverySettingController::class, 'index']);
    Route::put('/delivery-settings', [DeliverySettingController::class, 'update']);

    //Delivery Rates
    Route::get('/delivery-rates', [DeliveryRateController::class, 'index']);
    Route::put('/delivery-rates', [DeliveryRateController::class, 'update']);

    //Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->middleware('admin');

    //Produtos
    Route::get('/products', [ProductController::class, 'index']);
    Route::put('/products/sync', [ProductController::class, 'sync']);
    Route::put('/products/{product}', [ProductController::class, 'update']);


    //Test Sync
    Route::get('/test-sync', [OrderController::class, 'testSync']);
});

//Site
Route::prefix('store')->group(function () {
    //Route::get('/home', [StoreController::class, 'home']);
    Route::get('/products', [StoreController::class, 'products']);
    Route::get('/categories', [StoreController::class, 'categories']);
    Route::get('/settings', [StoreController::class, 'settings']);
    Route::get('/delivery-settings', [StoreController::class, 'deliverySettings']);
    Route::get('/delivery-rates', [StoreController::class, 'deliveryRates']);
    Route::get('/payments', [StoreController::class, 'paymentsTypes']);
    Route::post('/order', [StoreController::class, 'storeOrder'])->middleware('auth:sanctum');
    Route::post('/calculate-rate', [StoreController::class, 'calculateRate'])->middleware('auth:sanctum');

    Route::get('/address/{cep}', [ExtCustomerController::class, 'address']);
    Route::get('/states', [ExtCustomerController::class, 'states']);
    Route::get('/cities/{uf}', [ExtCustomerController::class, 'cities']);
});


// rutas públicas de customers
Route::prefix('customer')->group(function () {
    Route::post('/login',    [CustomerAuthController::class, 'login']);
    Route::post('/register', [CustomerAuthController::class, 'register']);
    Route::post('/login/google', [CustomerAuthController::class, 'loginWithGoogle']);
});

// rutas protegidas de customers
Route::middleware('auth:sanctum')->prefix('customer')->group(function () {
    Route::post('/logout', [CustomerAuthController::class, 'logout']);
    Route::get('/me',      [CustomerAuthController::class, 'me']);
});
