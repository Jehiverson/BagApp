import PropTypes from 'prop-types';
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Button, Typography, OutlinedInput, InputAdornment, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportePDF from './Reportes.pdf'; // Asegúrate de importar el componente ReportePDF adecuadamente
import Iconify from '../../../components/iconify';

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center', // Alinea verticalmente los elementos
  padding: theme.spacing(0, 1, 0, 3),
}));

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

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onDeleteSelected: PropTypes.func,
};

export default function UserListToolbar({ numSelected, filterName, onFilterName, onDeleteSelected, selected, }) {
  const showButtons = numSelected > 0;
  return (
    <StyledRoot
      sx={{
        ...(showButtons && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {showButtons ? (
        <>
        <Typography component="div" variant="subtitle1">
            {numSelected} selected
          </Typography>
          
          <Box display="flex" alignItems="center"> {/* Envuelve ambos botones en un contenedor flex */}
            <div style={{ marginRight: '10px' }}>
              <ReportePDF idActividad={selected} /> {/* Mueve el botón de ReportePDF aquí */}
            </div>

            <div style={{marginTop: 15}}>
              <Button variant="contained" color="success" size='small' startIcon={<CheckCircleIcon />} onClick={onDeleteSelected}>
                Completar
              </Button>
            </div>
          </Box>
        </>
      ) : (
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
