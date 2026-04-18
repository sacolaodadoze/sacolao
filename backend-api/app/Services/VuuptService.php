<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\Customer;
use App\Services\GeocodingService;
use Illuminate\Support\Facades\Log;



class VuuptService
{
    protected $geoService;

    public function __construct(GeocodingService $geoService)
    {
        $this->geoService = $geoService;
    }

    public function storeCustomer($customer)
    {
       //  dd($customer);  
        Log::info("Enviando cliente a Vuupt: " , $customer);
        $coords = $this->geoService->getGeocodeData($customer['address']);
     
        $customer['latitude'] = $coords['latitude'] ?? null;
        $customer['longitude'] = $coords['longitude'] ?? null;      

        $response = Http::withToken(env('VUUPT_TOKEN'))
            ->post('https://api.vuupt.com/api/v1/customers', $customer);

        Log::info("Cliente insertado en Vuupt: " , $response->json());
       // dd($response->json());
        return $response->json();
    }
}
