<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use App\Models\DeliverySetting;
use App\Models\DeliveryRate;
use App\Models\Category;

class StoreController extends Controller
{

    public function settings()
    {
        $settings = Setting::all();
        return response()->json($settings);
    }
    public function deliverySettings()
    {
        $deliverySettings = DeliverySetting::all();
        return response()->json($deliverySettings);
    }

    public function deliveryRates()
    {
        $rates = DeliveryRate::all();
        return response()->json($rates);
    }
    /* 
    public function home()
    {
        return response()->json(['message' => 'Welcome to the store home!']);
    } */
    public function products()
    {
        $products = Category::with('products')->orderBy('position')->get()->flatMap(function ($category) {
            return $category->products->map(function ($product) use ($category) {
                $product->category_name = $category->name;
                return $product;
            });
        });
        return response()->json($products);
    }
    public function categories()
    {
        $categories = Category::orderBy('position')
            ->get();
        return response()->json($categories);
    }
}
