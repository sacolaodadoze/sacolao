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

        return $earthRadius * $c;
    }

    //Calculo 
    public function calculateDistance($address, $lat, $lng)
    {
        $coords = $this->getGeocodeData($address);
        if (!$coords) return null;

        return $this->haversine($lat, $lng, $coords['latitude'], $coords['longitude']);
    }
}
