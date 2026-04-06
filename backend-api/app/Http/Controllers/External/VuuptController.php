<?php

namespace App\Http\Controllers\External;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Services\GeocodingService;


class VuuptController extends Controller
{

    public function getData(Request $request)
    {
        $response = Http::withToken(env('VUUPT_TOKEN'))
            // ->get( "https://api.vuupt.com/api/v1/customers?fields=name,code,latitude,longitude&filter[0][field]=code&filter[0][operator]=eq&filter[0][value]=23",
            ->get('https://api.vuupt.com/api/v1/customers', [
                'fields' => 'id,name,code,address,address_complement,phone_number,latitude,longitude',
                'filter[0][field]' => 'code',
                'filter[0][operator]' => 'eq',
                'filter[0][value]' => $request->input('customer_code')
            ]);
        if ($response->failed()) {
            return response()->json([
                'success' => false,
                'message' => 'Erro na API externa'
            ], 500);
        }

        $data = $response->json();
        if (empty($data['data'])) {
            return response()->json([
                'success' => false,
                'message' => 'Cliente não encontrado'
            ], 404);
        }

        return $data;
    }

    public function store(Request $request)
    {
        $start = now()->addHour();
        $scheduled_start = $request->delivery_date !== null ? Carbon::parse($request->delivery_date . " " . $request->delivery_hour . ":00")->format('Y-m-d\TH:i:sP') : $start->format('Y-m-d\TH:i:sP');
        $scheduled_end = $request->delivery_date !== null ? Carbon::parse($request->delivery_date . ' ' . $request->delivery_hour)
            ->addMinutes(30)
            ->format('Y-m-d\TH:i:sP') : $start->copy()->addMinutes(30)->format('Y-m-d\TH:i:sP');

        $orderData = [
            'title' => $request->delivery_date ? $request->title . " " . "AG" . $request->delivery_hour . " HRS" : $request->title,
            'type' => "delivery",
            'email' => "",
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'address_complement' =>  $request->address_complement ?? "",
            'address_location_type' => "geocomplete",
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'scheduled_start' =>  $scheduled_start,
            'scheduled_end' => $scheduled_end,
            'note' => "",
            'duration_id' => "1239",
            'duration_prevision_time' => "8",
            'dimension_1' => "",
            'dimension_2' => "",
            'dimension_3' => "",
            'dimension_4' => "",
            'dimension_5' => "",
            'cost_fixe' => "0.000",
            'cost_per_time' => "0.000",
            'customer_id' => $request->id,
            'extraFields' => [
                'field_boolean_1' => $request->paid ? 1 : 0
            ]
        ];

        $response = Http::withToken(env('VUUPT_TOKEN'))
            ->post('https://api.vuupt.com/api/v1/services', $orderData);
        // dd($response->json());
        return $response->json();
    }

    public function storeCustomer(Request $request, GeocodingService $geoService)
    {
        $coords = $geoService->getGeocodeData($request->address);
        $customerData = [
            'name' => $request->name,
            'code' =>  $request->customer_code,
            'address' => $request->address,
            'address_complement' =>  $request->address_complement ?? "",
            'phone_number' => $request->phone_number,
            'latitude' => $coords['latitude'] ?? null,
            'longitude' => $coords['longitude'] ?? null
        ];
        //dd($customerData);
        $response = Http::withToken(env('VUUPT_TOKEN'))
            ->post('https://api.vuupt.com/api/v1/customers', $customerData);
        return $response->json();
    }

    public function updateService($service, $paid)
    {
        $response = Http::withToken(env('VUUPT_TOKEN'))
            ->put("https://api.vuupt.com/api/v1/services/{$service['id']}", [
                'extraFields' => [
                    'field_boolean_1' => (int) $paid
                ]
            ]);
        return $response->json();
    }

    public function getService()
    {
        $serviceData = Http::withToken(env('VUUPT_TOKEN'))
            ->get('https://api.vuupt.com/api/v1/services?sort=-created_at');
        $data = collect($serviceData->json()['data']);
        return $data;
    }
}
