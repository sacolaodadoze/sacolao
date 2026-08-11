<?php

namespace App\Services;

class GeocodingService
{
    function getGeocodeData($address)
    {

        $address = urlencode($address);

        $googleMapUrl = "https://maps.googleapis.com/maps/api/geocode/json?address={$address}&key=" . env('GOOGLE_MAPS_API_KEY');
        $geocodeResponseData = file_get_contents($googleMapUrl);
        $responseData = json_decode($geocodeResponseData, true);

        if ($responseData['status'] == 'OK') {
            $latitude = isset($responseData['results'][0]['geometry']['location']['lat']) ? $responseData['results'][0]['geometry']['location']['lat'] : "";
            $longitude = isset($responseData['results'][0]['geometry']['location']['lng']) ? $responseData['results'][0]['geometry']['location']['lng'] : "";
            $formattedAddress = isset($responseData['results'][0]['formatted_address']) ? $responseData['results'][0]['formatted_address'] : "";
            if ($latitude && $longitude && $formattedAddress) {
                return [
                    'address_formatted' => $formattedAddress,
                    'latitude' => $latitude,
                    'longitude' => $longitude,
                ];
            } else {
                return false;
            }
        } else {
            echo "ERROR: {$responseData['status']}";
            return false;
        }
    }

    //distancia en kilómetros entre dos coordenadas usando la fórmula matemática de Haversine
    public function haversine($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371;

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        $straightLine = $earthRadius * $c;

        return $straightLine * 1.4; //  factor de corrección urbano,para zonas urbanas suele ser entre 1.3 y 1.5
    }




    function getRealRouteData($lat1, $lon1, $lat2, $lon2)
    {
        // OSRM requiere estrictamente el orden: longitud,latitud
        $url = "https://router.project-osrm.org/route/v1/driving/{$lon1},{$lat1};{$lon2},{$lat2}";
        //dd($url);

        // Usamos el cliente HTTP nativo de Laravel que maneja mejor los errores que file_get_contents
        $response = \Illuminate\Support\Facades\Http::get($url, [
            'overview' => 'false',
            'steps' => 'false'
        ]);
//dd($response);
        if ($response->successful()) {
            $responseData = $response->json();

            if (isset($responseData['code']) && $responseData['code'] == 'Ok' && !empty($responseData['routes'])) {
                $distanceInMeters = $responseData['routes'][0]['distance'];
                $durationInSeconds = $responseData['routes'][0]['duration'];

                return [
                    'distance_km' => round($distanceInMeters / 1000, 2),       // Ej: 4.02
                    'duration_minutes' => (int) round($durationInSeconds / 60) // Ej: 10
                ];
            }
        }

        return false; // Retorna falso si el servidor de OSRM falla o no encuentra ruta
    }

    //Calculo de distancia 
    public function calculateDistance($address, $lat, $lng)
    {
        /* $coords = $this->getGeocodeData($address);
        if (!$coords) return null;

        return $this->haversine($lat, $lng, $coords['latitude'], $coords['longitude']); */


        //$direccionOrigen = "Rua Doze de Outubro, 630 - Vila Margarida, Ourinhos - SP";
        //$direccionDestino = "Avenida Gastão Vidigal, 515 - Jardim Matilde, Ourinhos - SP";

        // Paso 1: Obtener coordenadas de origen con TU función
        $destinoData = $this->getGeocodeData($address);
        //dd($destinoData);

        // Paso 2: Obtener coordenadas de destino con TU función
       // $destinoData = $this->getGeocodeData($direccionDestino);

        // Validar que ambas direcciones hayan sido geocodificadas con éxito
        if (/* $origenData && */ $destinoData) {

            // Paso 3: Calcular la ruta REAL por calle usando OSRM
            $rutaReal = $this->getRealRouteData(
               /*  $origenData['latitude'],
                $origenData['longitude'], */
                $lat, $lng,
                $destinoData['latitude'],
                $destinoData['longitude']
            );
             dd($rutaReal);

            if ($rutaReal) {
                // ¡Listo! Aquí tienes los valores exactos reales
                $distanciaFinal = $rutaReal['distance_km'];     // Dará ~4.0 km en lugar de los 2.6 km de Haversine
                $tiempoEstimado = $rutaReal['duration_minutes']; // Dará ~10 minutos

                return response()->json([
                    'status' => 'success',
                    //'origen' => $origenData['address_formatted'],
                    'destino' => $destinoData['address_formatted'],
                    'distancia_calle_km' => $distanciaFinal,
                    'tiempo_minutos' => $tiempoEstimado
                ]);
            }
        }

        return response()->json(['status' => 'error', 'message' => 'No se pudo calcular la ruta'], 400);
    }
}
