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
        $perPage = $request->integer('per_page', 20);
        $page = $request->integer('page', 1);

        $products = Product::orderBy('id', 'asc')
            ->paginate(
                $perPage,
                ['*'],
                'page',
                $page
            );

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
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)

    {
        $data = $request->validate([
            'category_id' => ['nullable', 'integer'],
            'price_per_kg' => ['nullable', 'numeric'],
            'price_per_unit' => ['nullable', 'numeric'],
            'active' => ['nullable', 'boolean'],
            'featured' => ['nullable', 'boolean'],
            'promotion' => ['nullable', 'boolean'],
            'new_product' => ['nullable', 'boolean'],
            'week_offer' => ['nullable', 'boolean'],
        ]);

        $product->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Produto atualizado com sucesso',
        ]);
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
     * Update or insert in storage.
     */
    public function sync(HiperProductService $service)
    {
       
        $service->getProducts();

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
