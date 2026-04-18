<?php

namespace App\Imports;

use App\Helpers\ImportHelper;
use App\Http\Controllers\External\VuuptController;
use App\Models\Customer;
use App\Imports\AddressImport;
use App\Imports\PhoneImport;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow; // Para usar nomes de cabecera
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Collection;
use App\Services\GeocodingService;
use App\Services\VuuptService;



class CustomerImport implements ToCollection, WithHeadingRow, WithChunkReading
{
    private int $totalRows = 0;
    private int $inserted = 0;
    private int $updated = 0;

    protected $vuuptService;
    protected $geoService;

    public function __construct(GeocodingService $geoService, VuuptService $vuuptService)
    {
        $this->vuuptService = $vuuptService;
        $this->geoService = $geoService;
    }
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function collection(Collection $rows)
    {
        $this->totalRows += $rows->count(); // suma por chunk
        //$customersToInsert = [];


        DB::transaction(function () use ($rows, &$customersToInsert) {
            /****** Trae solo los clientes que cumplen las dos condiciones:
                document está en la lista del CSV ,customer_code es NULL *******/
            // $documents = [];

            foreach ($rows as $row) {

                //$document = (new ImportHelper())->validatedValue($row, 'cnpjcpf');
                $document = preg_replace('/\D/', '', trim($row['cnpjcpf'] ?? ''));
                // dd($document);

                if ($document !== '' && !isset($documents[$document])) {
                    // if ($document && !isset($documents[$document])) {
                    $documents[$document] =  $row['codigo'];
                }
            }

            $existingCustomers = Customer::whereIn('document', array_keys($documents))
                ->whereNull('customer_code')
                ->get();

            foreach ($existingCustomers as $customer) {
                // dd($customer);  
                $customer->update([
                    'customer_code' => $documents[$customer->document]
                ]);
                $customer->save();

                //Inserttar en vuupt
                $data = Customer::with('phones', 'addresses')->find($customer->id);
                //  dd($data);
                $customerData = [
                    'name' => $data['name'],
                    'code' =>  $data['customer_code'],
                    'address' => ($data['addresses'][0]['street'] ?? '') . ', ' .
                        ($data['addresses'][0]['number'] ?? '') . ' ' .
                        ($data['addresses'][0]['neighborhood'] ?? '') . ' ' .
                        ($data['addresses'][0]['city'] ?? '') . '-' .
                        ($data['addresses'][0]['state'] ?? '') . ', ' .
                        ($data['addresses'][0]['cep'] ?? ''),
                    'phone_number' => $data['phones'][0]['number'] ?? "",
                ];
              
                //dd($customerData);
                $this->vuuptService->storeCustomer($customerData);
                //  $customersToInsert[] = $customer;                
            }

            ///////////////////////////////////////
            $codes = [];

            foreach ($rows as $row) {
                /* if (in_array($row['codigo'], $existing)) {
                    $updated++;
                } else {
                    $inserted++;
                } */

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

            //Saber cuantos upd or insert
            $existing = Customer::whereIn('customer_code', $codes)
                ->pluck('customer_code')
                ->toArray();
            $existing = array_flip($existing);  //Intercambia claves por valores

            foreach ($codes as $code) {
                if (isset($existing[$code])) {
                    $this->updated++;
                } else {
                    $this->inserted++;
                }
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
    Customer::count()  ); */

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

        /* foreach ($customersToInsert as $customer) {
           // dd($customer);
            $this->vuuptService->storeCustomer($customer);  
        } */
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

    //  total de filas procesadas
    public function getStats(): array
    {
        return [
            'total' => $this->totalRows,
            'inserted' => $this->inserted,
            'updated' => $this->updated
        ];
    }
}
