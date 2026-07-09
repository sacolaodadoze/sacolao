<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Setting;
use App\Models\DeliverySetting;
use App\Models\DeliveryRate;
use App\Models\Category;
use App\Models\PaymentType;
use App\Models\Product;
use App\Models\Order;
use App\Models\Phone;
use App\Models\Address;
use App\Models\Detail;
use App\Models\Observation;

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
    public function products(Request $request)
    {
        /*  $products = Category::with('products')->orderBy('position')->get()->flatMap(function ($category) {
            return $category->products->map(function ($product) use ($category) {
                $product->category_name = $category->name;
                return $product;
            });
        });
        return response()->json($products); */

        $query = Product::with('category')
            ->where('active', true)
            /*     ->whereNotNull('category_id')
            ->where(function ($q) {
                $q->where('unit', '!=', 'KG')
                    ->orWhere(function ($q) {
                        $q->where('unit', 'KG')
                            ->where('average_weight', '>', 0);
                    });
            }) */;

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('code', 'ILIKE', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $products = $query
            ->orderBy('name')
            ->get();

        return response()->json($products);
    }
    public function categories()
    {
        $categories = Category::orderBy('position')
            ->get();
        return response()->json($categories);
    }

    public function paymentsTypes()
    {
        $payments = PaymentType::all();
        return response()->json($payments);
    }

    public function storeOrder(Request $request, Order $order)
    {
        $rules = [
            //'id' => 'nullable|numeric',
            // 'customer_id' => 'required|exists:customers,id',
            'items' => 'required|string',
            'payment_types_id' => 'required|exists:payment_types,id',
            'pickup' => 'nullable|boolean',
            //'paid' => 'nullable|boolean',
            // 'rate_id' => 'nullable|exists:rates,id',
            /* 'delivery_date' => 'nullable|date|required_if:scheduled,true',
            'delivery_hour' => 'nullable|date_format:H:i|required_if:scheduled,true',
            'order_id' => 'nullable|exists:orders,id',*/
            // 'observations' => 'nullable|string',
            'details' => 'nullable|string',
            //'customerChanged' => 'required|boolean',
            'phone' => 'nullable|string',
            'street'      => 'required_unless:pickup,true|string',
            'cep'      => 'nullable|string',
            'number' => 'nullable|string',
            'neighborhood' => 'nullable|string',
            'complement' => 'nullable|string',
            'city' => 'required|string',
            'state' => 'required|string',
        ];
        $data = $request->validate($rules);


        $order = DB::transaction(function () use ($data) {

            //Dados do cliente
            /*    if (($data['customerChanged']) == true) {
                Phone::updateOrCreate(
                    ['customer_id' => $data['customer_id']],
                    [
                        'number' => $data['phone'] ?? null
                    ]
                ); */

            //Address::updateOrCreate(
            /*      Address::created(
                   
                    [
                        'cep' => $data['cep'],
                        'street' => $data['street'],
                        'number' => $data['number'],
                        'neighborhood' => $data['neighborhood'],
                        'complement' => $data['complement'],
                        'city' => $data['city'],
                        'state' => $data['state'],
                    ]
                ); */
            // }

            //  Observaçoes del cliente
            //  if (!empty($data['observations'])) {
            /* Observation::updateOrCreate(
                    ['customer_id' => $data['customer_id']],
                    [
                        'content' => $data['observations'],
                    ]
                ); */
            /*   Observation::created([
                     'content' => $data['observations']
                ]);
            } */


            //Dados do pedido
            $orderData = [
                'customer_id'      => 23, //teste
                'payment_types_id' => $data['payment_types_id'],
                'entry_id'         => 3, //site
                'items'            => $data['items'],
                'paid'             => $data['paid'] ?? false,
                'pickup'         => $data['pickup'],
                'rate_id'         => $data['rate_id'] ?? null,
                'delivery_date'         => $data['delivery_date'] ?? null,
                'delivery_hour'         => $data['delivery_hour'] ?? null,
                'created_by' => 8 //user Site
            ];

            /*   if (!empty($data['id'])) {
                //  Log::info('order');
                $order = Order::findOrFail($data['id']);
                $order->update($orderData);
            } else {
                $order = Order::create($orderData);
            } */

            $order = Order::create($orderData);

            //  Detalhes
            if (!empty($data['details'])) {
                /*   $order->detail()->updateOrCreate(
                    ['order_id' => $order->id], //data.detail.id
                    [
                        'description' => $data['details'],
                    ]
                ); */
                Detail::create([
                    'order_id' => $order->id,
                    'description' => $data['details']
                ]);
            }
            return $order;
        });

        $order->load(['detail', 'customer',  'customer.addresses',  'customer.phones',  'customer.observation',  'entry',  'payment',  'rate',  'user']);

        return response()->json($order, 201);
    }
}
