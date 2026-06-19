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
        $search = $request->search;
        $categoryId = $request->input('category_id');
        $unit = $request->unit;
        $status = $request->status;


        $query = Product::query();

        // Buscar por nombre o código
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('code', 'ILIKE', "%{$search}%");
            });
        }

        // Filtrar por categoría
        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        // Filtrar por unit
        if ($unit) {
            $query->where('unit', $unit);
        }

        //Status
        if ($status === 'configured') {
            $query->whereNotNull('category_id')
                ->where(function ($q) {
                    $q->where('unit', '!=', 'KG')
                        ->orWhere(function ($q) {
                            $q->where('unit', 'KG')
                                ->where('average_weight', '>', 0);
                        });
                });
        }

        if ($status === 'pending') {
            $query->where(function ($q) {
                $q->whereNull('category_id')
                    ->orWhere(function ($q) {
                        $q->where('unit', 'KG')
                            ->where(function ($q) {
                                $q->whereNull('average_weight')
                                    ->orWhere('average_weight', '<=', 0);
                            });
                    });
            });
        }

        $products = $query
            ->orderBy('id')
            ->paginate(
                $perPage,
                ['*'],
                'page',
                $page
            );

        return response()->json($products);

        /*   $products = Product::orderBy('id', 'asc')
            ->paginate(
                $perPage,
                ['*'],
                'page',
                $page
            );

        return response()->json($products); */
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
