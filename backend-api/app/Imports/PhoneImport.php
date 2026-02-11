<?php

namespace App\Imports;

use App\Models\Phone;
use App\Helpers\ImportHelper;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow; // Para usar nomes de cabecera

class PhoneImport implements ToModel, WithHeadingRow
{
    private $customer_id;

    // Reciber o ID do cliente al que pertence o telefone
    public function __construct($customer_id)
    {
        $this->customer_id = $customer_id;
    }

    /**
     * @param  $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model($row)
    {
      

        foreach (['telefone_principal','telefone_secundario', 'telefone_de_recado_1', 'telefone_de_recado_2'] as $field) {
            if ((new ImportHelper())->isValid($row[$field])) { // saber si o campo é válido
                Phone::updateOrCreate(
                    [
                        'customer_id' => $this->customer_id,
                        'type' => match ($field) {                            
                            'telefone_secundario' => 2,
                            'telefone_de_recado_1' => 3,
                            'telefone_de_recado_2' => 4,
                            default => 1,
                        }
                        
                    ],
                    [
                        'number' => $row[$field],
                    ]
                );
            }
        }
        //todo ver que retorno aqui
        return true;

    }
}
