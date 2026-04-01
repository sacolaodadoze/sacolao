<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PdfService
{
    public function saveCustomerPdf($customer)
    {
        $html = '
        <h1>Dados do Cliente</h1>
        <p><strong>Tipo do cliente:</strong> ' . ($customer->customer_type === 1 ? ' Física' : 'Jurídica') . '</p>
        <p><strong>CPF:</strong> ' . $customer->document . '</p>
        <p><strong>Nome:</strong> ' . $customer->name . '</p>
      
        <p><strong>Telefones:</strong></p>
        <ul>';
        foreach ($customer->phones as $phone) {
            $html .= '<li>' . ($phone->type === 1 ? 'Principal' : 'Secundário') . ' : ' . $phone->number . '</li>';
        }

        $html .= '</ul><p><strong>Observações:</strong>' . $customer->observation?->content . '</p>';

        $html .= '<p><strong>Endereços</strong></p><ul>';
        foreach ($customer->addresses as $address) {
            $html .= '<li>' .
                ($address->is_primary === 1 ? 'Principal' : 'Cobrança') .  ':' . $address->cep . " - " . $address->street . "," . ($address->number ?? "S/N") . ","
                . ($address->complement ?? "-") . ", " . ($address->neighborhood ?? "-") . "," . $address->state . "-" . $address->city .
                '</li>';
        }

        $html .= '</ul>';

        $pdf = Pdf::loadHTML($html);

        $name = Str::slug($customer->name); // convierte a formato seguro
        $date = now()->format('d-m-Y'); // fecha bonita
        $fileName = "{$customer->id}_{$name}_({$date}).pdf";

        $path = "private/customers/{$fileName}";

        Storage::put($path, $pdf->output());
    }
}
