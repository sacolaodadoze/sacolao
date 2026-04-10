<?php

namespace App\Http\Controllers;

use Illuminate\Cache\Events\CacheFlushing;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\Phone;
use App\Models\Address;
use App\Models\Observation;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use App\Services\PdfService;
use App\Rules\CpfValid;
use App\Rules\PhoneValid;

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
    public function store(Request $request, PdfService $pdfService)
    {
        $validated = $request->validate([
            'customer_type' => 'required|in:1,2',
            'document'      => ['required', new CpfValid],
            'name'          => 'required|string',
            'phone_p'       => ['required', new PhoneValid],
            'phone_s'       => ['nullable', new PhoneValid],
            'observations'  => 'nullable|string',

             // Dirección principal
            'cep_1'         => 'nullable|string',
            'number_1'         => 'nullable|string',
            'complement_1'        => 'nullable|string',
            'street_1'      => 'nullable|string',
            'neighborhood_1' => 'nullable|string',
            'state_1'       => 'nullable|string',
            'city_1'        => 'nullable|string',

            // Dirección secundaria
            'cep_2'         => 'nullable|string',
            'number_2'         => 'nullable|string',
            'complement_2'        => 'nullable|string',
            'street_2'      => 'nullable|string',
            'neighborhood_2' => 'nullable|string',
            'state_2'       => 'nullable|string',
            'city_2'        => 'nullable|string',
        ]);
        // dd($validated);
        $customer = DB::transaction(function () use ($validated) {

            //Cliente
            $customer = Customer::create([
                'customer_type' => $validated['customer_type'],
                'document'      => $validated['document'],
                'name'          => $validated['name'],
                'customer_code' => null,
                //  'observations'  => $validated['observations'] ?? null,
            ]);


            //Teléfonos
            if (!empty($validated['phone_p'])) {
                Phone::create([
                    'customer_id' => $customer->id,
                    'number'      => $validated['phone_p'],
                    'type'        => '1'
                ]);
            }

            if (!empty($validated['phone_s'])) {
                Phone::create([
                    'customer_id' => $customer->id,
                    'number'      => $validated['phone_s'],
                    'type'        => '2'
                ]);
            }

            //  Dirección principal
            if (!empty($validated['cep_1'])) {
                Address::create([
                    'customer_id' => $customer->id,
                    'cep'         => $validated['cep_1'],
                    'number'         => $validated['number_1'],
                    'street'      => $validated['street_1'],
                    'neighborhood' => $validated['neighborhood_1'] ?? null,
                    'complement' => $validated['complement_1'] ?? null,
                    'state'       => $validated['state_1'],
                    'city'        => $validated['city_1'],
                    'is_primary'        => '1'
                ]);
            }

            //  Dirección secundaria
            if (!empty($validated['cep_2'])) {
                Address::create([
                    'customer_id' => $customer->id,
                    'cep'         => $validated['cep_2'],
                    'number'         => $validated['number_2'],
                    'street'      => $validated['street_2'],
                    'neighborhood' => $validated['neighborhood_2'] ?? null,
                    'complement' => $validated['complement_2'] ?? null,
                    'state'       => $validated['state_2'],
                    'city'        => $validated['city_2'],
                    'is_primary'        => '2'
                ]);
            }
            //
            //Observacoes
            if (!empty($validated['observations'])) {
                //dd($validate['observations']);
                Observation::create([
                    'customer_id' => $customer->id,
                    'content' => $validated['observations']
                ]);
            }
            //  dd($customer);
            return $customer;
        });

        $customer->load(['addresses', 'phones', 'observation']);
        $pdfService->saveCustomerPdf($customer);

        return response()->json([
            'data' => $customer,
            'message' => 'Cliente inserido com sucesso'
        ], 201);
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
                'phones:id,customer_id,number,type',
                'observation'
            ])
            ->select('*')
            // ->limit(10)
            ->get();

        return response()->json($customers);
    }
}
