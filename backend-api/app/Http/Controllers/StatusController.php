<?php

namespace App\Http\Controllers;

use App\Models\Estado;
use App\Models\Status;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {   
        $status = Status::all();     
        return response()->json($status);
    }
}
