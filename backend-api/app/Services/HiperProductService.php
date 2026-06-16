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

        $token =trim($this->getToken());      
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
         
            //try {


            Product::updateOrCreate(
                [
                    'code' => $item['codigo']
                ],
                [
                    'name' => $item['nome'],
                    'slug' => Str::slug($item['nome']),
                    'image' => $item['imagem']   ?? '',
                    'description' => $item['descricao'] ?? '',
                    'stock' => $item['quantidadeEmEstoque'] ?? 0,
                    'unit' => $item['unidade'] ?? '',
                    'average_weight' => $item['peso'] ?? 0,
                    'price' => $item['preco'] ?? 0,
                    'active' => $item['ativo']
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
