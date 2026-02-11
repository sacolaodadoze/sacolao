<?php

namespace App\Imports;

use App\Helpers\ImportHelper;
use App\Models\Customer;
use App\Imports\AddressImport;
use App\Imports\PhoneImport;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow; // Para usar nomes de cabecera
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Collection;


class CustomerImport implements ToCollection, WithHeadingRow, WithChunkReading
{

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function collection(Collection $rows)
    {
        DB::transaction(function () use ($rows) {
            $customers = [];
            $codes = [];

            foreach ($rows as $row) {

                $document = (new ImportHelper())->validatedValue($row, 'cnpjcpf');

                $customer_type = match ($row['tipo']) {
                    'Pessoa física' => 1,
                    'Pessoa jurídica' => 2,
                    default => 3,
                };

                $customers[] = [
                    'name'          => $row['nome'],
                    'customer_code' => $row['codigo'], //  único
                    'document'      => $document,
                    'customer_type' => $customer_type                  
                ];

                $codes[] = $row['codigo'];
            }

            //  UPSERT masivo
            Customer::upsert(
                $customers,
                ['customer_code'],
                ['name', 'document', 'customer_type']
            );

            //  Recuperar IDs dos customers importados
            $customersDB = Customer::whereIn('customer_code', $codes)
                ->get()
                ->keyBy('customer_code');

            /*  dd(
    count($codes),
    $customersDB->count(),
    Customer::count()
); */

            //Insertar endereços e telefones
            foreach ($rows as $row) {
                $customer = $customersDB[$row['codigo']] ?? null;
                if ($customer) {
                    (new PhoneImport($customer->id))->model($row);

                    // Criar o endereco usando o id do cliente
                    (new AddressImport($customer->id))->model($row);
                }
            }

        });
    }

    /**
     *Columna que identifica o registro único
     */
    public function uniqueBy()
    {
        return 'customer_code';
    }

    /**
     * Procesa o archivo en bloques de 1000
     */
    public function chunkSize(): int
    {
        return 1000;
    }
}
