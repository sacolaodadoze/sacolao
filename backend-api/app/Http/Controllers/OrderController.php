<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Order;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /*  $orders=\App\Models\Order::all();
        return response()->json($orders); */
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
            'scheduled'       =>  'nullable|boolean',

            'delivery_date' => 'nullable|date|required_if:scheduled,true',
            'delivery_hour'  => 'nullable|time|required_if:scheduled,true',

            'observations'   => 'nullable|string',
            'details'       => 'nullable|string',
            'order_id'        => 'nullable|exists:orders,id',

        ]);


        $order = DB::transaction(function () use ($data) {

        


            $orderData = [
                'customer_id'      => $data['customer_id'],
                'payment_types_id' => $data['payment_types_id'],
                'entry_id'         => $data['entry_id'],
                'items'            => $data['items'],
                'paid'             => $data['paid'],
                'pickup'         => $data['pickup'],
                'scheduled'         => $data['scheduled'],
            ];

            if (!empty($data['order_id'])) {
                $order = Order::findOrFail($data['order_id']);
                $order->update($orderData);
            } else {
                $order = Order::create($orderData);
            }

               //  Observaçoes
            if (!empty($data['observations'])) {
                $order->observation()->updateOrCreate(
                    [],
                    ['content' => $data['observations'],
                ]);
            }

            //  Detalhes
            if (!empty($data['details'])) {
                $order->detail()->updateOrCreate(
                    [],
                    ['description' => $data['details'],
                ]);
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
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
