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
use Illuminate\Support\Facades\Auth;

class StoreController extends Controller
{

    public function settings()
    {
        $settings = Setting::first();
        return response()->json($settings);
    }

    public function deliverySettings()
    {
        $deliverySettings = DeliverySetting::first();
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
        $categories = Category::whereNull('parent_id')
            ->with('children')
            ->orderBy('position')
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
/*   dd([
    'web' => Auth::guard('web')->check(),
    'customer' => Auth::guard('customer')->check(),
    'user' => Auth::guard('web')->user(),
    'customerUser' => Auth::guard('customer')->user(),
]); */
        $rules = [
            //'id' => 'nullable|numeric',
          //  'customer_id' => 'required|exists:customers,id',
            'items' => 'required|string',
            'payment_types_id' => 'required|exists:payment_types,id',
            'pickup' => 'nullable|boolean',
            //'paid' => 'nullable|boolean',
            // 'rate_id' => 'nullable|exists:rates,id',
            'delivery_date' => 'nullable|date|required_if:scheduled,true',
            'delivery_hour' => 'nullable|date_format:H:i|required_if:scheduled,true',
            //'order_id' => 'nullable|exists:orders,id',          
            'details' => 'nullable|string',
            //'customerChanged' => 'required|boolean',
            'phone' => 'required|string',
            'street'      => 'required_unless:pickup,true|string',
            'cep'      => 'nullable|string',
            'number' => 'nullable|string',
            'neighborhood' => 'nullable|string',
            'complement' => 'nullable|string',
            'city' => 'required|string',
            'state' => 'required|string',
        ];

        $data = $request->validate($rules);
        //dd($data);

        $customer = $request->user();
       // dd($customer);


        $order = DB::transaction(function () use ($data, $customer) {

            //Dados do cliente

            Phone::updateOrCreate(
                ['customer_id' => $customer->id, 'type' => 1],
                ['number'      => $data['phone']]
            );
            if (empty($data['pickup'])) {
                Address::updateOrCreate(
                    ['customer_id' => $customer->id, 'is_primary' => 1],
                    [
                        'street'       => $data['street'],
                        'number'       => $data['number']       ?? null,
                        'neighborhood' => $data['neighborhood'] ?? null,
                        'complement'   => $data['complement']   ?? null,
                        'city'         => $data['city'],
                        'state'        => $data['state'],
                        'cep'          => $data['cep']          ?? null,
                    ]
                );
            }
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
                'customer_id'      => $customer->id,
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
