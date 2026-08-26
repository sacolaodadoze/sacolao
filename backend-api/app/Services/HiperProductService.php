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

        foreach ($products['produtos'] as $item) {
            /*  $description = ($item['unidade'] == "KG")
                ?  "Produto vendido por "
                . number_format($item['preco'], 2, ',', '.')
                . "/Kg. O preço abaixo considera uma unidade média de "
                . $item['peso']
                . "g do produto. O preço final será definido após a pesagem do produto."
                : ""; */

            $product = Product::updateOrCreate(
                [
                    'code' => $item['codigo']
                ],
                [
                    'name' => $item['nome'],
                    'slug' => Str::slug($item['nome']),
                    'image' => $item['imagem']   ?? '',
                    // 'description' => $item['descricao'] ?? "",
                    'stock' => $item['quantidadeEmEstoque'] ?? 0,
                    'unit' => $item['unidade'] ?? '',
                    'price' => $item['preco'] ?? 0,
                    //  'price_hiper' => $item['preco'] ?? 0,                 
                    'active' => $item['ativo'],

                    ...(
                       !empty($item['descricao'])
                        ? ['description' => $item['descricao']]
                        : []
                    ),
                ]
            );
            // Si el campo 'price' acaba de cambiar en esta ejecución actualizar el "price_per_unit "
            if ($product->wasChanged('price') /* || $product->wasRecentlyCreated */) {

                if ($product->unit === "KG" && $product->average_weight > 0) {
                    $product->price_per_unit = $product->price * $product->average_weight;

                    $description = ($item['unidade'] == "KG")
                        ?  "Produto vendido por "
                        . number_format($product->price, 2, ',', '.')
                        . "/Kg. O preço abaixo considera uma unidade média de "
                        . $product->average_weight
                        . "g do produto. O preço final será definido após a pesagem do produto."
                        : "";
                    $product->description = $description;
                    $product->save();
                }
            }
        }

        /* $apiCodes = collect($products['produtos'])
            ->pluck('codigo')
            ->map(fn($c) => (string) $c);

        $dbCodes = Product::pluck('code')
            ->map(fn($c) => (string) $c);

        dd($apiCodes->diff($dbCodes)->values()); */
    }
}
