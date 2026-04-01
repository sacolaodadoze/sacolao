<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class LocationService
{
    /**
     * Obter endereço
     *
     * @param $cep
     * @return void
     */
    public function getAddress($cep)
    {
        return Cache::remember("cep_$cep", 86400, function () use ($cep) {

            $response = Http::get("https://viacep.com.br/ws/$cep/json/");

            if ($response->successful()) {
                return $response->json();
            }

            // fallback
            return Http::get("https://brasilcep.dev/api/cep/v1/$cep")->json();
        });
    }

    public function getStates()
    {
        return Cache::remember('br_states', 86400, function () { //86400-Guarda los estados en cache durante 1 día
            $response = Http::get(
                'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
            );

            return collect($response->json())
                ->sortBy('nome')
                ->values();
        });
    }

    public function getCities($uf)
    {
       // dd($uf);
        return Cache::remember("br_cities_$uf", 86400, function () use ($uf) {
            $response = Http::get(
                "https://servicodados.ibge.gov.br/api/v1/localidades/estados/{$uf}/municipios"
            );

            return collect($response->json())
                ->sortBy('nome')
                ->values();
        });
    }
}
