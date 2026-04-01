<?php

namespace App\Http\Controllers\External;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Services\LocationService;

class ExtCustomerController extends Controller {
protected $service;

    public function __construct(LocationService $service)
    {
        $this->service = $service;
    }

    public function states()
    {
        return response()->json($this->service->getStates());
    }

    public function cities($uf)
    {
      return response()->json($this->service->getCities($uf));
    }

    public function address($cep){
        return response()->json($this->service->getAddress($cep));
    }
}
