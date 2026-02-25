<?php

namespace App\Http\Controllers;

use Illuminate\Cache\Events\CacheFlushing;
use Illuminate\Http\Request;
use App\Models\Customer;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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

    /**
     * 
     */
    public function search(Request $request)
    {

        $search = trim($request->query('q'));

       /*  if (strlen($search) < 3) { //todo , ver despues,es para que busque luego de que el user escriba 3 caracteres 
            return response()->json([]);
        } */


        $customers = Customer::search($search)
            ->with([
                'addresses:id,customer_id,street,number,city,state,cep,complement,neighborhood,is_primary',
                'phones:id,customer_id,number,type','observation'
            ])
            ->select('*')
            // ->limit(10)
            ->get();

        return response()->json($customers);
    }
}
