<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Services\PdfService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Container\Attributes\Log;

use Illuminate\Http\Request;

class PdfController extends Controller
{

    public function list()
    {
        $files = Storage::files('private/customers');
        // devolver solo el nombre del archivo
        $files = collect($files)->map(fn($file) => basename($file));

        return response()->json($files);
    }

    public function show(Request $request)
    {
        $file = $request->query('file'); // nombre del archivo

        $path = storage_path("app/private/private/customers/$file");        

        // Validación básica: evita acceder a otros directorios
        if (!file_exists($path)) {
            return response()->json([
                'error' => 'Archivo no encontrado',
                'path' => $path
            ], 404);
        }
//dd($path, file_exists($path));
        // Mostrar en el navegador      
        return response()->file($path, [
            'Content-Type' => 'application/pdf',
        ]);
    }

    public function delete(Request $request)
    {
        $file = $request->input('file');

        // Seguridad básica
        if (strpos($file, '..') !== false) {
            return response()->json(['error' => 'Archivo inválido'], 400);
        }

        $path = "private/customers/$file";


        if (!Storage::exists($path)) {
            return response()->json([
                'error' => 'Archivo no encontrado',
                'path' => $path // 
            ], 404);
        }
        Storage::delete($path);

        return response()->json([
            'message' => 'PDF eliminado correctamente'
        ]);
    }
}
