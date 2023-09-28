import numeral from 'numeral';

// La importación anterior trae la librería numeral, que se utiliza para el formateo de números.

// Función para formatear un número en un formato estándar.
export function fNumber(number) {
  // Utiliza la librería numeral para formatear el número en un formato estándar y lo devuelve como una cadena de texto.
  return numeral(number).format();
}

// Función para formatear un número como una cantidad de dinero en formato de moneda (p. ej., $1,234.56).
export function fCurrency(number) {
  // Si el número no es nulo, utiliza numeral para formatear el número en formato de moneda y lo devuelve como una cadena de texto.
  // Si el número es nulo, se devuelve una cadena vacía.
  const format = number ? numeral(number).format('$0,0.00') : '';

  // Llama a la función "result" para eliminar los ceros fraccionarios ".00" si están presentes en el formato.
  return result(format, '.00');
}

// Función para formatear un número como un porcentaje (p. ej., 25.0%).
export function fPercent(number) {
  // Si el número no es nulo, divide el número por 100, utiliza numeral para formatear el resultado como porcentaje y lo devuelve como una cadena de texto.
  // Si el número es nulo, se devuelve una cadena vacía.
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  // Llama a la función "result" para eliminar el cero decimal ".0" si está presente en el formato.
  return result(format, '.0');
}

// Función para formatear un número de forma abreviada (p. ej., 1.23k para 1230).
export function fShortenNumber(number) {
  // Si el número no es nulo, utiliza numeral para formatear el número de forma abreviada y lo devuelve como una cadena de texto.
  // Si el número es nulo, se devuelve una cadena vacía.
  const format = number ? numeral(number).format('0.00a') : '';

  // Llama a la función "result" para eliminar los ceros fraccionarios ".00" si están presentes en el formato.
  return result(format, '.00');
}

// Función para formatear un número como datos (p. ej., 1.2 MB).
export function fData(number) {
  // Si el número no es nulo, utiliza numeral para formatear el número como datos y lo devuelve como una cadena de texto.
  // Si el número es nulo, se devuelve una cadena vacía.
  const format = number ? numeral(number).format('0.0 b') : '';

  // Llama a la función "result" para eliminar el cero decimal ".0" si está presente en el formato.
  return result(format, '.0');
}

// Función para eliminar parte del formato de números (p. ej., ".00" en "$1,234.56").
function result(format, key = '.00') {
  // Comprueba si el formato incluye la clave proporcionada (por defecto, ".00").
  const isInteger = format.includes(key);

  // Si el formato incluye la clave, reemplaza la clave con una cadena vacía. Si no, devuelve el formato sin cambios.
  return isInteger ? format.replace(key, '') : format;
}
