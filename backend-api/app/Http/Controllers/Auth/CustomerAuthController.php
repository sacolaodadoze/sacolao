<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Customer;
use App\Models\Phone;
use Illuminate\Support\Facades\Hash;

class CustomerAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $customer = Customer::where('email', $request->email)->with(['addresses', 'phones'])->first();

        if (!$customer || !Hash::check($request->password, $customer->password)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        $token = $customer->createToken('customer_token')->plainTextToken;

        return response()->json([
            'token'    => $token,
            'customer' => $customer,
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'         => 'required|string',
            'document'     => 'required',
            'email'        => 'required|email|unique:customers,email',
            'password'     => 'required|min:6|confirmed',
            'phone'        => 'nullable|string',
            'street'       => 'nullable|string',
            'number'       => 'nullable|string',
            'complement'   => 'nullable|string',
            'neighborhood' => 'nullable|string',
            'city'         => 'nullable|string',
            'state'        => 'nullable|string',
            'cep'          => 'nullable|string',
        ]);

        $existing = Customer::where('document', $request->document)->first();

        if ($existing) {
            // cliente ya existe — actualizás todo incluyendo email y password
            $existing->update([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
            ]);
            $customer = $existing;
        } else {
            // cliente nuevo — creás con todo
            $customer = Customer::create([
                'name'          => $request->name,
                'document'      => $request->document,
                'customer_type' => 1,
                'email'         => $request->email,
                'password'      => Hash::make($request->password),
            ]);
        }

        // teléfono
        if ($request->phone) {
            Phone::updateOrCreate(
                ['customer_id' => $customer->id, 'type' => 1],
                ['number'      => $request->phone]                
            );
        }

        // dirección
        if ($request->street) {
            Address::updateOrCreate(
                ['customer_id' => $customer->id, 'is_primary' => 1],
                [
                    'street'       => $request->street,
                    'number'       => $request->number,
                    'complement'   => $request->complement,
                    'neighborhood' => $request->neighborhood,
                    'city'         => $request->city,
                    'state'        => $request->state,
                    'cep'          => $request->cep,
                ]
            );
        }

        $token = $customer->createToken('customer_token')->plainTextToken;

        return response()->json([
            'token'    => $token,
            'customer' => $customer->load(['addresses', 'phones']),
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout exitoso']);
    }

    public function me(Request $request)
    {
        dd($request->user()->load(['addresses', 'phones']));
        return response()->json($request->user()->load(['addresses', 'phones']));
    }
}
