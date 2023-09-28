import { format, getTime, formatDistanceToNow } from 'date-fns';

// La importación anterior trae tres funciones de la librería date-fns: format, getTime y formatDistanceToNow.

// Función para formatear una fecha en el formato especificado.
export function fDate(date, newFormat) {
  // Se proporciona un formato personalizado como 'newFormat', o se usa 'dd MMM yyyy' por defecto.
  const fm = newFormat || 'dd MMM yyyy';

  // Si la fecha no es nula, se formatea utilizando el formato especificado y se devuelve como una cadena de texto.
  // Si la fecha es nula, se devuelve una cadena vacía.
  return date ? format(new Date(date), fm) : '';
}

// Función para formatear una fecha y hora en el formato especificado.
export function fDateTime(date, newFormat) {
  // Se proporciona un formato personalizado como 'newFormat', o se usa 'dd MMM yyyy p' por defecto.
  const fm = newFormat || 'dd MMM yyyy p';

  // Si la fecha no es nula, se formatea utilizando el formato especificado y se devuelve como una cadena de texto.
  // Si la fecha es nula, se devuelve una cadena vacía.
  return date ? format(new Date(date), fm) : '';
}

// Función para obtener el valor de tiempo UNIX en milisegundos a partir de una fecha.
export function fTimestamp(date) {
  // Si la fecha no es nula, se obtiene el valor de tiempo UNIX en milisegundos y se devuelve como un número.
  // Si la fecha es nula, se devuelve una cadena vacía.
  return date ? getTime(new Date(date)) : '';
}

// Función para formatear una fecha en relación al tiempo actual, por ejemplo, "hace 5 minutos".
export function fToNow(date) {
  // Si la fecha no es nula, se calcula la distancia desde la fecha proporcionada hasta el tiempo actual
  // y se devuelve como una cadena de texto que indica la diferencia en tiempo relativo.
  // Si la fecha es nula, se devuelve una cadena vacía.
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}
