<?php

namespace App\Http\Controllers\Admin;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\HiperProductService;

class ProductController extends Controller

{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $perPage = (int) $request->perPage ?? 20;
        $page = (int) $request->currentPage;
        $products = Product::paginate($perPage, ['*'], 'page', $page);
        return response()->json($products);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(HiperProductService $service)
    {
        $products = $service->getProducts();
       // dd($products['produtos']);
        foreach ($products['produtos'] as $item) {

            Product::updateOrCreate(
                [
                    'code' => $item['codigo']
                ],
                [
                    'name' => $item['nome'],
                    'description' => $item['descricao']??'',
                    'price' => $item['preco'],
                    'average_weight' => $item['peso'],
                    'unit' => $item['unidade']??'',
                    'image' => $item['imagem']?? '',
                    'stock' => $item['quantidadeEmEstoque']?? 0,
                    //'category_id' => "nu"
                ]
            );
        }

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
