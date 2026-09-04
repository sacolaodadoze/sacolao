export function validarDocumento(documento) {
  const numero = documento.replace(/\D/g, "");

  // CPF
  if (numero.length === 11) {
    if (/^(\d)\1{10}$/.test(numero)) return false;

    let suma = 0;

    for (let i = 0; i < 9; i++) {
      suma += Number(numero[i]) * (10 - i);
    }

    let resto = (suma * 10) % 11;
    if (resto === 10) resto = 0;

    if (resto !== Number(numero[9])) return false;

    suma = 0;

    for (let i = 0; i < 10; i++) {
      suma += Number(numero[i]) * (11 - i);
    }

    resto = (suma * 10) % 11;
    if (resto === 10) resto = 0;

    return resto === Number(numero[10]);
  }

  // CNPJ
  if (numero.length === 14) {
    if (/^(\d)\1{13}$/.test(numero)) return false;

    let peso = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let suma = 0;

    for (let i = 0; i < 12; i++) {
      suma += Number(numero[i]) * peso[i];
    }

    let resto = suma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;

    if (digito1 !== Number(numero[12])) return false;

    peso = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    suma = 0;

    for (let i = 0; i < 13; i++) {
      suma += Number(numero[i]) * peso[i];
    }

    resto = suma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;

    return digito2 === Number(numero[13]);
  }

  return false;
}

export function validarTelefone(phone) {
  const numero = phone.replace(/\D/g, "");

  return numero.length === 10 || numero.length === 11;
}