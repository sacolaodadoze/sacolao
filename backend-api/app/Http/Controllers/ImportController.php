<?php

namespace App\Http\Controllers;

use App\Imports\CustomerImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Delay;

class ImportController extends Controller
{

    /**
     * Undocumented function
     *
     * @param Request $request
     * @return void
     */
    public function store(Request $request)
    {
        // dd($request);
        // Validamos que el archivo llegó y es un CSV
        $request->validate([
            'archivo_csv' => 'required|file|mimes:csv,txt',
            'id_import' => 'required'
        ]);

        try {
            //  Ejecutamos la importación usando la librería Laravel Excel
            // Pasamos el archivo directamente desde el objeto $request
            $CustomerImport = new CustomerImport();
            $res = Excel::import($CustomerImport, $request->file('archivo_csv'));
            $totalRows = $CustomerImport->getStats()['total'];
            $inserted = $CustomerImport->getStats()['inserted'];
            $updated = $CustomerImport->getStats()['updated'];

            return response()->json([
                'message' => '¡Base de datos PostgreSQL actualizada con éxito!',
                'total_procesados' => $totalRows,
                'total_insertados' => $inserted,
                'total_actualizados' => $updated
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al procesar el archivo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostre uma lista de pedidos com seus relacionamentos.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        //
    }
}
