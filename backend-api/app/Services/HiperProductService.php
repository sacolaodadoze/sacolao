<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

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
                'Erro ao gerar token do Hiper'
            );
        }

        return $response->json()['token'];
    }

    public function getProducts()
    {

        $token = trim($this->getToken());
        $response = Http::withToken($token)
            ->get(config('services.hiper.products_url'));

        $products = $response->json();


        /*         file_put_contents(
    storage_path('app/hiper_key.json'),
    $response->body()
); 

dd('guardado');*/


        /*        $apiCodes = collect($products['produtos'])
        ->pluck('codigo')
        ->map(fn($c) => (string) $c);

    $dbCodes = Product::pluck('code')
        ->map(fn($c) => (string) $c);



        /*   $codes = collect($products['produtos'])->pluck('codigo');

        dd([
            'total' => $codes->count(),
            'unicos' => $codes->unique()->count(),
        ]); */
        foreach ($products['produtos'] as $item) {
            $description = ($item['unidade'] == "KG")
                ?  "Produto vendido por "
                . number_format($item['preco'], 2, ',', '.')
                . "/Kg. O preço acima considera uma unidade média de "
                . $item['peso']
                . "g do produto. O preço final será definido após a pesagem do produto."
                : "";
            //try {f
            Product::updateOrCreate(
                [
                    'code' => $item['codigo']
                ],
                [
                    'name' => $item['nome'],
                    'slug' => Str::slug($item['nome']),
                    'image' => $item['imagem']   ?? '',
                    'description' => $description,
                    'stock' => $item['quantidadeEmEstoque'] ?? 0,
                    'unit' => $item['unidade'] ?? '',
                    //'average_weight' => $item['peso'] ?? 0,
                    'price_hiper' => $item['preco'] ?? 0,
                    'price' => ($item['unidade'] === "UN") ? $item['preco'] :[],
                    'active' => $item['ativo'],                  
                ]
            );
            /*    } catch (\Exception $e) {
            dd($e->getMessage(), $products);
        } */
        }

        /* $apiCodes = collect($products['produtos'])
            ->pluck('codigo')
            ->map(fn($c) => (string) $c);

        $dbCodes = Product::pluck('code')
            ->map(fn($c) => (string) $c);

        dd($apiCodes->diff($dbCodes)->values()); */
    }


    /* public function sync()
    {
        $response = Http::get(
            config('services.hiper.products_url')
        );
        dd(config('services.hiper.products_url'));

        $products = $response->json();
   /*     dd(
    $response->successful(),
    $response->status(),
    $response->body() 
);

    }*/
}
