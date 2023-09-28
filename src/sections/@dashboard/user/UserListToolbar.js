import PropTypes from 'prop-types';
// Importaciones de estilos y componentes de Material-UI
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@mui/material';
// Importación de un componente personalizado llamado Iconify
import Iconify from '../../../components/iconify';

// Componente StyledRoot definido usando estilos personalizados
const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

// Componente StyledSearch definido usando estilos personalizados
const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// Propiedades esperadas para el componente UserListToolbar
UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onDeleteSelected: PropTypes.func, // Asegúrate de tener esto definido
};

// Componente principal UserListToolbar
export default function UserListToolbar({ numSelected, filterName, onFilterName, onDeleteSelected, selected }) {
  return (
    // Componente StyledRoot representa la barra de herramientas superior
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {/* Mostrar el número de elementos seleccionados si numSelected es mayor que 0 */}
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        // Caso contrario, muestra el campo de búsqueda StyledSearch
        <StyledSearch
          value={filterName}
          onChange={onFilterName}
          placeholder="Search user..."
          startAdornment={
            <InputAdornment position="start">
              {/* Componente Iconify se usa como un icono de búsqueda */}
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}

      {/* Mostrar el botón de eliminación si numSelected es mayor que 0 */}
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={onDeleteSelected}>
            {/* Componente Iconify se usa como un icono de eliminación */}
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      )}
    </StyledRoot>
  );
}
