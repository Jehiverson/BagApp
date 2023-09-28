import PropTypes from 'prop-types';
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Button, Typography, OutlinedInput, InputAdornment, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportePDF from './Reportes.pdf'; // Asegúrate de importar el componente ReportePDF adecuadamente
import Iconify from '../../../components/iconify';

// Estilo personalizado para el componente Toolbar llamado StyledRoot
const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96, // Altura de la barra de herramientas
  display: 'flex', // Muestra los elementos en fila
  justifyContent: 'space-between', // Espacio entre elementos
  alignItems: 'center', // Alinea verticalmente los elementos
  padding: theme.spacing(0, 1, 0, 3), // Espaciado personalizado
}));

// Estilo personalizado para el componente OutlinedInput llamado StyledSearch
const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240, // Ancho predeterminado
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320, // Ancho cuando el campo está enfocado
    boxShadow: theme.customShadows.z8, // Sombra cuando el campo está enfocado
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`, // Borde personalizado
  },
}));

// Definición de los tipos de propiedades esperadas por el componente
UserListToolbar.propTypes = {
  numSelected: PropTypes.number, // Número de elementos seleccionados
  filterName: PropTypes.string, // Valor del campo de búsqueda
  onFilterName: PropTypes.func, // Función para manejar el cambio en el campo de búsqueda
  onDeleteSelected: PropTypes.func, // Función para manejar la eliminación de elementos seleccionados
};

// Función principal del componente UserListToolbar
export default function UserListToolbar({ numSelected, filterName, onFilterName, onDeleteSelected, selected }) {
  const showButtons = numSelected > 0; // Determina si se deben mostrar los botones
  return (
    <StyledRoot
      sx={{
        ...(showButtons && {
          color: 'primary.main', // Cambia el color del texto si hay elementos seleccionados
          bgcolor: 'primary.lighter', // Cambia el fondo si hay elementos seleccionados
        }),
      }}
    >
      {showButtons ? ( // Mostrar botones si hay elementos seleccionados
        <>
          <Typography component="div" variant="subtitle1">
            {numSelected} selected
          </Typography>
          
          <Box display="flex" alignItems="center"> {/* Envuelve ambos botones en un contenedor flex */}
            <div style={{ marginRight: '10px' }}>
              <ReportePDF idActividad={selected} /> {/* Mueve el botón de ReportePDF aquí */}
            </div>

            <div style={{ marginTop: 15 }}>
              <Button variant="contained" color="success" size='small' startIcon={<CheckCircleIcon />} onClick={onDeleteSelected}>
                Completar
              </Button>
            </div>
          </Box>
        </>
      ) : ( // Mostrar campo de búsqueda si no hay elementos seleccionados
        <StyledSearch
          value={filterName}
          onChange={onFilterName}
          placeholder="Search user..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}
    </StyledRoot>
  );
}
