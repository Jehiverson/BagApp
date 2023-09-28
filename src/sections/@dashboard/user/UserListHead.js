import PropTypes from 'prop-types';
// Importación de componentes y estilos desde Material-UI
import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';

// Objeto para ocultar elementos visualmente
const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

// Propiedades esperadas para el componente UserListHead
UserListHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
  showCheckbox: PropTypes.bool, // Propiedad adicional para mostrar o no el checkbox
};

// Componente principal UserListHead
export default function UserListHead({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick,
  showCheckbox, // Propiedad para determinar si se muestra el checkbox
}) {
  // Función para manejar la solicitud de ordenamiento por columna
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  // Obtener el objeto de usuario desde el almacenamiento local
  const localStorageUser = JSON.parse(localStorage.getItem('user'));
  // Extraer el valor de 'tipoRol' del objeto de usuario
  const role = localStorageUser ? localStorageUser.tipoRol : null;

  return (
    // Encabezado de la tabla
    <TableHead>
      <TableRow>
        {/* Renderizar el checkbox solo si showCheckbox es true y el rol es 'Administrador' */}
        {showCheckbox && role === 'Administrador' && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
        )}
        {/* Iterar sobre las etiquetas de encabezado y crear las columnas */}
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {/* Etiqueta para ordenar las columnas */}
            <TableSortLabel
              hideSortIcon // Ocultar el ícono de ordenamiento por defecto
              active={orderBy === headCell.id} // Marcar si la columna está activa
              direction={orderBy === headCell.id ? order : 'asc'} // Dirección de ordenamiento
              onClick={createSortHandler(headCell.id)} // Manejar el clic para ordenar
            >
              {headCell.label}
              {/* Mostrar un mensaje visualmente oculto para indicar el orden actual */}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === 'desc' ? 'ordenado descendente' : 'ordenado ascendente'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
