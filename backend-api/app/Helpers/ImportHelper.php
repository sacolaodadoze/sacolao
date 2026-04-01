<?php

namespace App\Helpers;

use Maatwebsite\Excel\Concerns\WithCustomCsvSettings; // Para el delimitador ;

class ImportHelper implements WithCustomCsvSettings
{
    public function getCsvSettings(): array
    {
        return [
            'delimiter' => ';',
            'input_encoding' => 'UTF-8' // O 'ISO-8859-1' si vem de um Excel antigo
        ];
    }

    // Filtra null, strings vacíos y o carácter '-'
    public function isValid($value): bool
    {

        return !empty($value) && $value !== '-';
    }

    //Retorna o valor ou null
    public function validatedValue($row, string $key)
    {
        $value = $row[$key] ?? null;
        return $this->isValid($value) ? $value : null;
    }
  
}
