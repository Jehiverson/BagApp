// Importa las funciones y ganchos relacionados con el sistema de diseño de Material-UI (@mui).
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ----------------------------------------------------------------------
// Función personalizada que verifica la coincidencia con una consulta de medios y devuelve un valor booleano.
export default function useResponsive(query, start, end) {
  const theme = useTheme();

  // Verifica si la ventana está arriba (mayor o igual) a la consulta de medios especificada.
  const mediaUp = useMediaQuery(theme.breakpoints.up(start));

  // Verifica si la ventana está abajo (menor o igual) a la consulta de medios especificada.
  const mediaDown = useMediaQuery(theme.breakpoints.down(start));

  // Verifica si la ventana está entre dos consultas de medios especificadas.
  const mediaBetween = useMediaQuery(theme.breakpoints.between(start, end));

  // Verifica si la ventana coincide exactamente con la consulta de medios especificada.
  const mediaOnly = useMediaQuery(theme.breakpoints.only(start));

  // Devuelve el resultado de la consulta de medios según el valor de 'query'.
  if (query === 'up') {
    return mediaUp;
  }

  if (query === 'down') {
    return mediaDown;
  }

  if (query === 'between') {
    return mediaBetween;
  }

  return mediaOnly;
}

// ----------------------------------------------------------------------
// Función personalizada que devuelve el ancho actual de la ventana según el sistema de diseño de Material-UI (@mui).
export function useWidth() {
  const theme = useTheme();

  // Obtiene las claves (nombres) de las consultas de medios y las invierte para comenzar desde la más grande.
  const keys = [...theme.breakpoints.keys].reverse();

  return (
    keys.reduce((output, key) => {
      // Comprueba si la ventana cumple con la consulta de medios actual.
      // No quitar el comentario de eslint, por reglas de eslint tira error el useMediaQuery
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));

      // Si encuentra una coincidencia, devuelve la clave (nombre) de la consulta.
      return !output && matches ? key : output;
    }, null) || 'xs' // Si no se encuentra una coincidencia, devuelve 'xs' por defecto.
  );
}
