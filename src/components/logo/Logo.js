import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box} from '@mui/material';
import LogoTipo from '../../assets/images/LogoFinal.png'; 

const Logo = forwardRef(({ disabledLink = false, ...other }, ref) => {
  const logo = (
    <Box
      ref={ref}
      component={RouterLink}
      to="/"
      sx={{
        width: 50,
        height: 50,
        display: 'inline-flex',
        backgroundImage: `url(${LogoTipo})`, // Usa tu imagen personalizada como fondo
        backgroundSize: 'cover', // Ajusta el tamaño de la imagen según lo necesario
        textDecoration: 'none',
        color: 'inherit',
        cursor: disabledLink ? 'default' : 'pointer',
        ...other.sx, // Puedes añadir estilos adicionales desde las propiedades
      }}
    >
      &nbsp; {/* Espacio en blanco para evitar la advertencia */}
    </Box>
  );

  return disabledLink ? <>{logo}</> : logo;
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
};

export default Logo;
