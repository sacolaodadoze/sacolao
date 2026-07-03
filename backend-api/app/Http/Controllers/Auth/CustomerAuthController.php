<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Customer;
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
            'name'     => 'required|string',
            'email'    => 'required|email|unique:customers',
            'password' => 'required|min:6|confirmed',
            'phone'    => 'nullable|string',
            'street'   => 'nullable|string',
            'number'   => 'nullable|string',
            'district' => 'nullable|string',
            'city'     => 'nullable|string',
        ]);

        $customer = Customer::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone'    => $request->phone,
            'street'   => $request->street,
            'number'   => $request->number,
            'district' => $request->district,
            'city'     => $request->city,
        ]);

        $token = $customer->createToken('customer_token')->plainTextToken;

        return response()->json([
            'token'    => $token,
            'customer' => $customer,
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout exitoso']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load(['addresses', 'phones']));
    }
}
