<?php

namespace App\Http\Controllers;

use App\Http\Controllers\External\VuuptController;
use App\Models\Address;
use App\Models\Customer;
use App\Models\Observation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\Phone;
use Illuminate\Support\Facades\Log;

use function Laravel\Prompts\alert;


class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // dd($request->page);
        //dd($request->search);
        // Eager Loading: Carregue todos os relacionamentos necessários de uma só vez
        $query = Order::with([
            'entry:id,name',
            'status:id,name',
            'payment:id,name',
            'rate:id,rate',
            'detail:id,order_id,description',
            'delay:id,order_id,description',
            'customer.addresses',
            'customer.phones:id,customer_id,number,type',
            'customer.observation:id,customer_id,content',
            'user:id,name,role'
        ]);
        //  dd($query->toSql(), $query->getBindings());
        /* dd([
    'search' => $request->query('search'),
    'type' => gettype($request->query('search')),
]);
     */
        $search = trim((string)$request->query('search', ''));
        // if (isset($search) && strlen(trim($search)) > 0) {
        //dump($request->query('search')); 
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                // Buscar exacto por número de orden
                $q->where('number', 'ilike', "{$search}%")
                    // O buscar exacto por el nombre del cliente relacionado
                    ->orWhereHas('customer', function ($q2) use ($search) {
                        $q2->where('name', 'ilike', "{$search}%");
                    });
            });
        }
        /*   DB::listen(function ($query) {
            dump([
                'sql' => $query->sql,
                'bindings' => $query->bindings,
                'time' => $query->time,
            ]);
        });  */
        //}
        //dd($request->perPage);
        $orders = $query->orderBy('id', 'desc')->paginate(
            $request->perPage,
            ['*'],
            'page',
            $request->page
        ); //->get();

        return response()->json($orders);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Function para update or crear
     *
     * @param Request $request
     * @return void
     */
    public function store(Request $request, VuuptController $vuuptController)
    {
        $user = $request->user();

        $rules = [
            'id' => 'nullable|numeric',
            'customer_id' => 'required|exists:customers,id',
            'items' => 'required|string',
            'payment_types_id' => 'required|exists:payment_types,id',
            'entry_id' => 'required|exists:entries,id',
            'pickup' => 'nullable|boolean',
            'paid' => 'nullable|boolean',
            'rate_id' => 'nullable|exists:rates,id',
            'delivery_date' => 'nullable|date|required_if:scheduled,true',
            'delivery_hour' => 'nullable|date_format:H:i|required_if:scheduled,true',
            'order_id' => 'nullable|exists:orders,id',
            'observations' => 'nullable|string',
            'details' => 'nullable|string',
            'customerChanged' => 'required|boolean',
            'phone' => 'nullable|string',
            'street'      => 'required_unless:pickup,true|string',
            'cep'      => 'required_unless:pickup,true|string',
            'number' => 'nullable|string',
            'neighborhood' => 'nullable|string',
            'complement' => 'nullable|string',
            'city' => 'required|string',
            'state' => 'required|string',
        ];

        if ($request->filled('id')) {
            unset(
                $rules['phone'],
                $rules['cep'],
                $rules['street'],
                $rules['number'],
                $rules['neighborhood'],
                $rules['complement'],
                $rules['city'],
                $rules['state']
            );
        }
         if ($request->filled('pickup') && $request->pickup == true) {
            unset(               
                $rules['cep'],
                $rules['street'],
                $rules['number'],
                $rules['neighborhood'],
                $rules['complement'],
                $rules['city'],
                $rules['state']
            );
        }
        $data = $request->validate($rules);
        
        //Update pedidio no VUUPT
        if (isset($data['id'])) {
            $order_v = Order::with('customer')->find($data['id']);           
            if ($data["paid"] !== $order_v->paid) {              
                $request = new \Illuminate\Http\Request(); //para poder pasarle el parametro, porque recibe un request
                $request->merge(['customer_code' => $order_v->customer["customer_code"]]);

                $vuupt = $vuuptController->getData($request);
                $customer_id = $vuupt['data'][0]['id']; 
                           
                $allServices = $vuuptController->getService();
              
                $service = $allServices->firstWhere('customer_id', $customer_id);
          
                if ($service !== null) {
                  $vuuptController->updateService($service, $data["paid"]);                  
                }
            }
        }
      

        $order = DB::transaction(function () use ($data, $user) {

            //Dados do cliente
            if (($data['customerChanged']) == true) {
                Phone::updateOrCreate(
                    ['customer_id' => $data['customer_id']],
                    [
                        'number' => $data['phone'] ?? null
                    ]
                );

                Address::updateOrCreate(
                    ['customer_id' => $data['customer_id']],
                    [
                        'cep' => $data['cep'],
                        'street' => $data['street'],
                        'number' => $data['number'],
                        'neighborhood' => $data['neighborhood'],
                        'complement' => $data['complement'],
                        'city' => $data['city'],
                        'state' => $data['state'],
                    ]
                );
            }

            //  Observaçoes del cliente
            if (!empty($data['observations'])) {
                Observation::updateOrCreate(
                    ['customer_id' => $data['customer_id']],
                    [
                        'content' => $data['observations'],
                    ]
                );
            }


            //Dados do pedido
            $orderData = [
                'customer_id'      => $data['customer_id'],
                'payment_types_id' => $data['payment_types_id'],
                'entry_id'         => $data['entry_id'],
                'items'            => $data['items'],
                'paid'             => $data['paid'],
                'pickup'         => $data['pickup'],
                'rate_id'         => $data['rate_id'] ?? null,
                'delivery_date'         => $data['delivery_date'] ?? null,
                'delivery_hour'         => $data['delivery_hour'] ?? null,
                'created_by' => $user->id
            ];

            if (!empty($data['id'])) {
                //  Log::info('order');
                $order = Order::findOrFail($data['id']);
                $order->update($orderData);
            } else {
                $order = Order::create($orderData);
            }

            //  Detalhes
            if (!empty($data['details'])) {
                $order->detail()->updateOrCreate(
                    ['order_id' => $order->id], //data.detail.id
                    [
                        'description' => $data['details'],
                    ]
                );
            }
            return $order;
        });

        $order->load(['detail', 'customer',  'customer.addresses',  'customer.phones',  'customer.observation',  'entry',  'payment',  'rate',  'user']);      

        return response()->json($order, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::with(['detail', 'entry', 'payment', 'rate', 'user', 'customer', 'customer.observation', 'customer.addresses', 'customer.phones'])->find($id);
        return response()->json($order, 201);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Função excluir pedido
     *
     * @param int $id
     * @return cod 200
     */
    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Pedido não encontrado'], 404);
        }
        try {
            $order->delete();
            return response()->json(['message' => 'OK'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao excluir pedido'], 500);
        }
    }
}
