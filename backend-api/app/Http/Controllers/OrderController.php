<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Customer;
use App\Models\Observation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\Phone;

use function Laravel\Prompts\alert;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Eager Loading: Carregue todos os relacionamentos necessários de uma só vez
        $orders = Order::with([
            'entry:id,name',
            'status:id,name',
            'payment:id,name',
            'detail:id,order_id,description',
            'delay:id,order_id,description',
            'customer.addresses',
            'customer.phones:id,customer_id,number,type',
            'customer.observation:id,customer_id,content'
        ])->get();

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
    public function store(Request $request)
    {
       
        $data = $request->validate([
            'customer_id'    => 'required|exists:customers,id',
            'items'          => 'required|string',
            'payment_types_id'     => 'required|exists:payment_types,id',
            'entry_id'       => 'required|exists:entries,id',
            'pickup'       =>  'nullable|boolean',
            'paid'           => 'nullable|boolean',
            'delivery_date' => 'nullable|date|required_if:scheduled,true',
            'delivery_hour'  => 'nullable|date_format:H:i|required_if:scheduled,true',

            'order_id'        => 'nullable|exists:orders,id',
            'observations'   => 'nullable|string',
            'details'       => 'nullable|string',

            'customerChanged' => "required|boolean",
            'phone' => 'nullable|string', //required
            'cep' => 'required|string',
            'street' => 'required|string',
            'number' => 'required|string',
            'neighborhood' => 'nullable|string',
            'complement' => 'nullable|string',
            'city' => 'required|string',
            'state' => 'required|string',
        ]);


        $order = DB::transaction(function () use ($data) {
          

            //Dados do cliente
            if (($data['customerChanged'])==true) {
                Phone::updateOrCreate(
                    ['customer_id' => $data['customer_id']],
                    [
                        'number' => $data['phone']?? null
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
                'paid'             => $data['paid']?? null,
                'pickup'         => $data['pickup']?? null,
                'delivery_date'         => $data['delivery_date'] ?? null,
                'delivery_hour'         => $data['delivery_hour'] ?? null,
            ];

            if (!empty($data['order_id'])) {
                $order = Order::findOrFail($data['order_id']);
                $order->update($orderData);
            } else {
                $order = Order::create($orderData);
            }

            //  Detalhes
            if (!empty($data['details'])) {
                $order->detail()->updateOrCreate(
                    [],
                    [
                        'description' => $data['details'],
                    ]
                );
            }


            return $order;
        });

        return response()->json($order, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
    public function destroy( $id)
    {
         $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Pedido no encontrado'], 404);
        }

        try {
            $order->delete();
            return response()->json(['message' => 'Pedido eliminado correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar el pedido'], 500);
        }
    }
    
}
