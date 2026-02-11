<?php

namespace App\Imports;

use App\Models\Address;
use App\Helpers\ImportHelper;
use Maatwebsite\Excel\Concerns\ToModel;

class AddressImport implements ToModel
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
    // Crear un novo endereço a partir de una fila importada
    public function model($row)
    {

        $importHelper = new ImportHelper();

        //Validar se ao menos tem um campo de endereço
        $camposEndereco = ['endereco', 'numero', 'cep', 'cidade', 'estado'];
        $camposValidos = array_filter($camposEndereco, fn($campo) => $importHelper->isValid($row[$campo]));

        if (empty($camposValidos)) {
            return null;
        }


        //Validar campos opcionais     
        $number = $importHelper->validatedValue($row, 'numero');
        $neighborhood = $importHelper->validatedValue($row, 'bairro');
        $complement = $importHelper->validatedValue($row, 'complemento');
        $city = $importHelper->validatedValue($row, 'cidade');
        $state = $importHelper->validatedValue($row, 'estado');


        return Address::updateOrCreate(
            [
                'cep' => $row['cep'], //busco por estes campos
                'customer_id' => $this->customer_id,

            ],
            [
                'customer_id' => $this->customer_id, //create o update  estes campos
                'street' => $row['endereco'],
                'number' => $number,
                'neighborhood' => $neighborhood,
                'complement' => $complement,
                'city' => $city,
                'state' => $state,
            ]
        );
    }
}
