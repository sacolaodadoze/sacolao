<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class PhoneValid implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // quitar todo lo que no sea número
        $phone = preg_replace('/\D/', '', $value);

        if (!preg_match('/^(55)?[1-9]{2}9\d{8}$/', $phone)) {
            $fail('O telefone deve ser um celular válido (com DDD).');
        }
        /* 
        if (!preg_match('/^(55)?[1-9]{2}9\d{8}$/', $phone)) {
            $fail('Telefone inválido');
        } */
    }
}
