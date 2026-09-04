<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidDocument implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
   public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $document = preg_replace('/\D/', '', $value);

        if (strlen($document) === 11) {

            if (!$this->validarCPF($document)) {
                $fail('O CPF informado é inválido.');
            }

            return;
        }

        if (strlen($document) === 14) {

            if (!$this->validarCNPJ($document)) {
                $fail('O CNPJ informado é inválido.');
            }

            return;
        }

        $fail('Informe um CPF ou CNPJ válido.');
    }

    private function validarCPF(string $cpf): bool
    {
        if (preg_match('/^(\d)\1{10}$/', $cpf)) {
            return false;
        }

        $soma = 0;

        for ($i = 0; $i < 9; $i++) {
            $soma += (int) $cpf[$i] * (10 - $i);
        }

        $resto = ($soma * 10) % 11;

        if ($resto === 10) {
            $resto = 0;
        }

        if ($resto !== (int) $cpf[9]) {
            return false;
        }

        $soma = 0;

        for ($i = 0; $i < 10; $i++) {
            $soma += (int) $cpf[$i] * (11 - $i);
        }

        $resto = ($soma * 10) % 11;

        if ($resto === 10) {
            $resto = 0;
        }

        return $resto === (int) $cpf[10];
    }

    private function validarCNPJ(string $cnpj): bool
    {
        if (preg_match('/^(\d)\1{13}$/', $cnpj)) {
            return false;
        }

        $peso = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        $soma = 0;

        for ($i = 0; $i < 12; $i++) {
            $soma += (int) $cnpj[$i] * $peso[$i];
        }

        $resto = $soma % 11;
        $digito1 = $resto < 2 ? 0 : 11 - $resto;

        if ($digito1 !== (int) $cnpj[12]) {
            return false;
        }

        $peso = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        $soma = 0;

        for ($i = 0; $i < 13; $i++) {
            $soma += (int) $cnpj[$i] * $peso[$i];
        }

        $resto = $soma % 11;
        $digito2 = $resto < 2 ? 0 : 11 - $resto;

        return $digito2 === (int) $cnpj[13];
    }
}
