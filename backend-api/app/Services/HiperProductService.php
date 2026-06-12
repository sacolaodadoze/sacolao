<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Http;

class HiperProductService
{
    public function getToken()
    {
        $response = Http::get(
            config('services.hiper.token_url') .
                config('services.hiper.api_key')
        );
        if (!$response->successful()) {
            throw new \Exception(
                'Erro ao gerar token Hiper'
            );
        }

        return $response->json()['token'];
    }

    public function getProducts()
    {
        $token = trim($this->getToken());
        $response = Http::withToken($token)
            ->get(config('services.hiper.products_url'));
/* 
        dd(
            $response->status(),
            $response->json()
        ); */
        return $response->json();
    }

    public function sync()
    {
        $response = Http::get(
            config('services.hiper.products_url')
        );

        $products = $response->json();

        foreach ($products as $item) {

            Product::updateOrCreate(
                [
                    'code' => $item['code']
                ],
                [
                    'name' => $item['name'],
                    'image' => $item['image'],
                    'description' => $item['description'],
                    'barcode' => $item['barcode'],
                    'average_weight' => $item['average_weight'],
                ]
            );
        }
    }
}
