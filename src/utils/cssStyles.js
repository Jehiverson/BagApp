// Importa la función 'alpha' de las bibliotecas de estilos de Material-UI (MUI).
import { alpha } from '@mui/material/styles';

// Función para aplicar un fondo desenfocado (blur) a un elemento.
export function bgBlur(props) {
  const color = props?.color || '#000000'; // Color de fondo (predeterminado: negro).
  const blur = props?.blur || 6; // Nivel de desenfoque (predeterminado: 6 píxeles).
  const opacity = props?.opacity || 0.8; // Opacidad del fondo (predeterminado: 0.8).
  const imgUrl = props?.imgUrl; // URL de la imagen de fondo (opcional).

  if (imgUrl) {
    // Si se proporciona una imagen de fondo, crea un estilo con la imagen de fondo y un filtro de desenfoque.
    return {
      position: 'relative',
      backgroundImage: `url(${imgUrl})`,
      '&:before': {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9,
        content: '""',
        width: '100%',
        height: '100%',
        backdropFilter: `blur(${blur}px)`, // Aplica un filtro de desenfoque.
        WebkitBackdropFilter: `blur(${blur}px)`, // Propiedad específica de Webkit para el filtro de desenfoque.
        backgroundColor: alpha(color, opacity), // Color de fondo con opacidad.
      },
    };
  }

  // Si no se proporciona una imagen de fondo, aplica el filtro de desenfoque directamente al elemento.
  return {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    backgroundColor: alpha(color, opacity),
  };
}

// Función para aplicar un fondo de gradiente a un elemento.
export function bgGradient(props) {
  const direction = props?.direction || 'to bottom'; // Dirección del gradiente (predeterminado: de arriba abajo).
  const startColor = props?.startColor; // Color de inicio del gradiente.
  const endColor = props?.endColor; // Color de fin del gradiente.
  const imgUrl = props?.imgUrl; // URL de la imagen de fondo (opcional).
  const color = props?.color; // Color de fondo.

  if (imgUrl) {
    // Si se proporciona una imagen de fondo, crea un estilo con el gradiente y la imagen de fondo.
    return {
      background: `linear-gradient(${direction}, ${startColor || color}, ${endColor || color}), url(${imgUrl})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
    };
  }

  // Si no se proporciona una imagen de fondo, aplica el gradiente directamente al elemento.
  return {
    background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
  };
}

// Función para aplicar un gradiente de texto.
export function textGradient(value) {
  return {
    background: `-webkit-linear-gradient(${value})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };
}

// Función para aplicar estilos de filtro a un elemento.
export function filterStyles(value) {
  return {
    filter: value,
    WebkitFilter: value,
    MozFilter: value,
  };
}

// Estilo para ocultar la barra de desplazamiento vertical.
export const hideScrollbarY = {
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  overflowY: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};

// Estilo para ocultar la barra de desplazamiento horizontal.
export const hideScrollbarX = {
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  overflowX: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};
