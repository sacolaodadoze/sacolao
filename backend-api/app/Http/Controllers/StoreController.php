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
use App\Services\GeocodingService;
use App\Services\DeliverySlotService;
use App\Models\OrderCapacity;

class StoreController extends Controller
{
    protected $geocodingService;

    public function __construct(GeocodingService $geocodingService, private DeliverySlotService $deliverySlotService) //private , no tengo que declararlo ni asignarlo manualmente como esta hecho con el otro service 
    {
        $this->geocodingService = $geocodingService;
    }

    public function settings()
    {
        $settings = Setting::first();
        $today    = now()->toDateString();
        $capacity = OrderCapacity::where('date', $today)->first();

        // agregás los cupos al objeto de settings
        $settings->delivery_morning   = $capacity?->morning_slots   ?? 0;
        $settings->delivery_afternoon = $capacity?->afternoon_slots ?? 0;
        $settings->delivery_saturday = $capacity?->saturday_slots ?? 0;
        $settings->delivery_sunday = $capacity?->sunday_slots ?? 0;
        //dd($settings);
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
            ->where('active', 'true')
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


    public function calculateRate(Request $request)
    {
        $request->validate([
            'cep'    => 'nullable|string',
            'street' => 'required|string',
            'number' => 'nullable|string',
            'city'   => 'required|string',
            'state'  => 'required|string',
            'order_total' => 'required|numeric',
        ]);

        $settings = Setting::first();

        if (!$settings->latitude || !$settings->longitude) {
            return response()->json(['error' => 'Coordenadas do estabelecimento não configuradas'], 422);
        }

        // usa CEP si tiene, sino usa dirección completa
        $address = $request->cep
            ? "{$request->cep}, Brasil"
            : "{$request->street}, {$request->number}, {$request->city}, {$request->state}, Brasil";

        $address = $this->geocodingService->getGeocodeData($address); //"19907-575, Brasil";
        // dd($address);
        $distance = $this->geocodingService->obtenerDistancia(
            $settings->latitude,
            $settings->longitude,
            $address['latitude'],
            $address['longitude']

        );
        //dd($distance);
        if (!$distance) {
            return response()->json(['error' => 'Endereço não encontrado'], 422);
        }

        $rate = DeliveryRate::where('min_distance', '<=', $distance)
            ->where(function ($q) use ($distance) {
                $q->where('max_distance', '>=', $distance)
                    ->orWhereNull('max_distance');
            })
            ->first();

        if (!$rate) {
            return response()->json([
                'distance'     => round($distance, 2),
                'rate'         => null,
                'out_of_range' => true,
                'delivery_fee' => null,
            ]);
        }

        $orderTotal  = $request->order_total;
        $deliveryFee = $orderTotal >= $rate->minimum_order
            ? $rate->delivery_fee_after_minimum  // cumple el mínimo
            : $rate->delivery_fee;               // no cumple el mínimo

        return response()->json([
            'distance'      => round($distance, 2),
            'rate'          => $rate,
            'delivery_fee'  => $deliveryFee,     //  taxa final a cobrar
            'meets_minimum' => $orderTotal >= $rate->minimum_order, //total del pedido cumple o no el minumum_order
            'out_of_range'  => false,
        ]);
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
            'scheduled'         => 'nullable|boolean',
            'delivery_date' => 'nullable|date|required_if:scheduled,true',
            'delivery_hour' => 'nullable|date_format:H:i|required_if:scheduled,true',
            //'order_id' => 'nullable|exists:orders,id',          
            'details' => 'nullable|string',
            //'customerChanged' => 'required|boolean',
            'phone' => 'required|string',
            'phoneS' => 'nullable|string',
            'street'      => 'required_unless:pickup,true|string',
            'cep'      => 'nullable|string',
            'number' => 'nullable|string',
            'neighborhood' => 'nullable|string',
            'complement' => 'nullable|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'substitution_preference' => 'required|in:similar,contact,remove',
            /* 'confirm_schedule_change' => 'nullable|boolean', */
        ];

        $data = $request->validate($rules);

        $customer = $request->user();

        /*         $settings =  Setting::first();
        //dd($settings->is_closed,$request->delivery_date);
        // Pedido para hoy
        if (
            ($settings->is_closed &&  $request->delivery_date === now()->toDateString())
            || ($settings->is_closed &&  $request->delivery_date === null)

        ) {
            return response()->json([
                'message' => 'Não é possível realizar entregas para hoje.'
            ], 422);
        } */

        $settings = Setting::first();
        $orderDate = $data['delivery_date'] ?? now()->toDateString();
       // dd( $orderDate);

         $hour = $data['delivery_hour']
            ? (int) explode(":", $data['delivery_hour'])[0]
            : now()->hour;

        $minute = $data['delivery_hour'] && isset(explode(":", $data['delivery_hour'])[1])
            ? (int) explode(":", $data['delivery_hour'])[1]
            : now()->minute; 

       // $hour = 23;   //  forzado para probar
      //  $minute = 0;  // forzado para probar

        $resolved = $this->deliverySlotService->resolveOrderSlot($settings, $orderDate, $hour, $minute);
        /*  dd([
            'weekday_open_morning'    => $settings->weekday_open_morning,
            'weekday_close_morning'   => $settings->weekday_close_morning,
            'weekday_open_afternoon'  => $settings->weekday_open_afternoon,
            'weekday_close_afternoon' => $settings->weekday_close_afternoon,
        ]); */
        // dd($resolved);

        /*  $dateWasAdjusted = $resolved['date'] !== $orderDate;

        //Si la data cambio 
       if ($dateWasAdjusted && empty($data['confirm_schedule_change'])) {
            return response()->json([
                'requires_confirmation' => true,
                'requested_date'        => $orderDate,
                'confirmed_date'        => $resolved['date'],
                'shift'                 => $resolved['shift'],
                'message'               => "O horário solicitado já está fechado. Seu pedido será agendado para "
                    . \Carbon\Carbon::parse($resolved['date'])->translatedFormat('d/m/Y') . ". Deseja continuar?",
            ], 200); // 200, no es un error, es una confirmación pendiente
        } */

        $closeMorningHour = (int) explode(":", $settings->weekday_close_morning)[0]; //Extrae solo la hora (sin minutos) del cierre de la mañana en días de semana.

        $capacity = OrderCapacity::firstOrCreate(
            ['date' => $resolved['date']], //fecha ya corregida
            [
                'morning_slots'   => $settings->delivery_morning,
                'afternoon_slots' => $settings->delivery_afternoon,
                'saturday_slots'  => $settings->delivery_saturday,
                'sunday_slots'    => $settings->delivery_sunday,
            ]
        );
        // dd($capacity);

        $slotsAvailable = $capacity->{$resolved['slotsField']};

        $ordersCount = Order::where(function ($q) use ($resolved) {
            $q->whereDate('delivery_date', $resolved['date'])
                ->orWhere(function ($q2) use ($resolved) {
                    $q2->whereNull('delivery_date')
                        ->whereDate('created_at', $resolved['date']);
                });
        })
            ->when($resolved['shift'] === 'morning', fn($q) => $q->whereRaw('EXTRACT(HOUR FROM COALESCE(delivery_hour, created_at::time)) < ?', [$closeMorningHour]))
            ->when($resolved['shift'] === 'afternoon', fn($q) => $q->whereRaw('EXTRACT(HOUR FROM COALESCE(delivery_hour, created_at::time)) >= ?', [$closeMorningHour]))
            ->count();

        if ($slotsAvailable !== null && $ordersCount >= $slotsAvailable) {
            $mensajes = [
                'morning'   => 'Não é possível fazer entregas no turno da manhã',
                'afternoon' => 'Não é possível fazer entregas no turno da tarde',
                'single'    => 'Não é possível fazer entregas nesse dia',
            ];
            return response()->json(['error' => $mensajes[$resolved['shift']]], 422);
        }


        /////////////////



        $order = DB::transaction(function () use ($data, $customer, $resolved) {

            //Dados do cliente

            Phone::updateOrCreate(
                ['customer_id' => $customer->id, 'type' => 1],
                ['number'      => $data['phone']]
            );

            if (!empty($data['phoneS'])) {
                Phone::updateOrCreate(
                    ['customer_id' => $customer->id, 'type' => 2],
                    ['number' => $data['phoneS']]
                );
            }


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

            //Dados do pedido
            $orderData = [
                'customer_id'      => $customer->id,
                'payment_types_id' => $data['payment_types_id'],
                'entry_id'         => 3, //site
                'items'            => $data['items'],
                'paid'             => $data['paid'] ?? false,
                'pickup'         => $data['pickup'],
                'rate_id'         => $data['rate_id'] ?? null,
                 'scheduled'         => $data['scheduled'] ?? false,
                'delivery_date'         => $resolved['date'],   //$data['delivery_date'] ?? null,
                'delivery_hour'         => $data['delivery_hour'] ?? null,
                'substitution_preference' => $data['substitution_preference'],
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
