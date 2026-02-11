<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use Illuminate\Http\Request;

class EntryController extends Controller
{
     public function index()
    {   
        $entry = Entry::all();     
        return response()->json($entry);
    }
}
