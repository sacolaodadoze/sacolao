<?php

namespace App\Http\Controllers\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;


class LoginController extends Controller
{
    //LOGIN
    public function login(Request $request)
    {
    
        $credentials = $request->validate([
            'name' => 'required|string',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $request->session()->regenerate();

        return response()->json([
            'name' => $request->user(),
            'message' => 'Login successful'
        ],200);
    }

    //LOGOUT
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout successful'
        ]);
    }

    // Usuario autenticado
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
