import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Card, Table, Stack, Paper, Button, Popover, Checkbox, TableRow, MenuItem, TableBody, TableCell, Container, Typography, IconButton, TableContainer, TablePagination, TextField, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import Modal from 'react-modal';
import moment from 'moment'; // Cambia la importación de moment
import 'moment/locale/es'; // Importa el idioma si lo deseas
import 'moment-timezone';
import swal from 'sweetalert';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

const TABLE_HEAD = [
  { id: 'nameClient', label: 'Nombre', alignRight: false },
  { id: 'apellidoClient', label: 'Apellido', alignRight: false },
  { id: 'DPI', label: 'DPI', alignRight: false },
  { id: 'estadoCivil', label: 'Estado Civil', alignRight: false },
  { id: 'trabajando', label: 'Trabaja', alignRight: false },
  { id: 'cantidadHijos', label: 'Cantidad de Hijos', alignRight: false },
  { id: 'idCliente', label: '', alignRight: false }, 
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter((_user) => _user && _user.nameClient.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
const estadosCiviles = ["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a", "Separado/a"];

export const handleDeleteSelected = async (selectedClient, clientes, setClientes) => {
  try {
    const idCliente = selectedClient.idCliente;

    // Enviar una petición DELETE para eliminar el registro
    await axios.delete(`http://localhost:5000/bagapp-5a770/us-central1/app/api/clientes/${idCliente}`);

    // Actualizar la lista de clientes después de eliminar
    const response = await axios.get('http://localhost:5000/bagapp-5a770/us-central1/app/api/clientes');
    setClientes(response.data);
  } catch (error) {
    console.error('Error al eliminar el registro:', error);
  }
};

export default function UserPage() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('nameClient');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [clientes, setClientes] = useState([]);
  const [isEditar, setIsEditar] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isNewEventModalOpen, setNewEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    nameClient: '',
    apellidoClient: '',
    fechaNacimiento: '',
    dpi: '',
    estadoCivil: '',
    trabajando: '',
    cantidadHijos: ''
  });
   const handleEstadoCivilChange = (event) => {
    setNewEvent({ ...newEvent, estadoCivil: event.target.value });
  };
  const handleTrabajandoChange = (event) => {
    setNewEvent({ ...newEvent, trabajando: event.target.value });
  };
  const handleNameChange = (e) => {
    const inputValue = e.target.value;
    if (/^[A-Za-z\s]+$/.test(inputValue) || inputValue === '') {
      setNewEvent({ ...newEvent, nameClient: inputValue });
    }
  };
  const handleApellidoChange = (e) => {
    const inputValue = e.target.value;
    if (/^[A-Za-z\s]+$/.test(inputValue) || inputValue === '') {
      setNewEvent({ ...newEvent, apellidoClient: inputValue });
    }
  };
  const handleDpiChange = (e) => {
    const inputValue = e.target.value;
    if (/^\d+$/.test(inputValue) || inputValue === '') {
      setNewEvent({ ...newEvent, dpi: inputValue });
    }
  };
  const handleCantidadHijosChange = (e) => {
    const inputValue = e.target.value;
    if (/^\d+$/.test(inputValue) || inputValue === '') {
      setNewEvent({ ...newEvent, cantidadHijos: inputValue });
    }
  };
  const NuevoCliente = () => {
    swal({
      title: 'Cliente ingresado',
      text: 'Nuevo cliente registrado',
      icon: 'success',
      timer: '500'
    })
  }

  useEffect(() => {
    axios.get('http://localhost:5000/bagapp-5a770/us-central1/app/api/clientes')
      .then(response => {
        setClientes(response.data);
        setSelectedClient(response.data.find(client => client.idCliente === 1));
      })
      .catch(error => {
        console.error('Error al obtener los datos de los clientes:', error);
      });
  }, []);
  const createEvent = async () => {
    try {
      const localStart = moment(newEvent.fechaNacimiento).tz('UTC').format('YYYY-MM-DD'); // Convertir a UTC y quitar la hora
      await axios.post('http://localhost:5000/bagapp-5a770/us-central1/app/api/clientes', {
        ...newEvent,
        fechaNacimiento: localStart,
      });
      NuevoCliente();
      closeNewEventModal();
      setNewEvent({
        nameClient: '',
        apellidoClient: '',
        fechaNacimiento: '',
        dpi: '',
        estadoCivil: '',
        trabajando: '',
        cantidadHijos: '',
      });
      // Actualizar la lista de clientes después de crear un nuevo evento
    const response = await axios.get('http://localhost:5000/bagapp-5a770/us-central1/app/api/clientes');
    setClientes(response.data);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  }; 
  const deleteSelected = () => {
    if (selected.length === 1) {
      const selectedName = selected[0];
      const selectedClient = clientes.find(cliente => cliente.nameClient === selectedName);
      handleDeleteSelected(selectedClient, clientes, setClientes);
      setSelected([]);
    }
  };  
  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = clientes.map((n) => n.nameClient);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const openNewEventModal = () => {
    setNewEventModalOpen(true);
  };

  const closeNewEventModal = () => {
    setNewEventModalOpen(false);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - clientes.length) : 0;

  const filteredUsers = applySortFilter(clientes, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Clientes</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Clientes
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={openNewEventModal}>
            Nuevo Cliente
          </Button>
        </Stack>
        <Modal
          isOpen={isNewEventModalOpen}
          onRequestClose={closeNewEventModal}
          style={{
            overlay: {
              zIndex: 1000,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            content: {
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '8px',
              padding: '20px',
              maxWidth: '600px',
              margin: 'auto',
            },
          }}
        >
          {/* Contenido del modal */}
          <div>
          <TextField
            type="text"
            label="Nombre"
            value={newEvent.nameClient}
            onChange={handleNameChange}
            fullWidth
            error={newEvent.nameClient !== '' && !/^[A-Za-z\s]+$/.test(newEvent.nameClient)}
            helperText={newEvent.nameClient !== '' && !/^[A-Za-z\s]+$/.test(newEvent.nameClient) ? 'No se permiten números' : ''}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            type="text"
            label="Apellido"
            value={newEvent.apellidoClient}
            onChange={handleApellidoChange}
            fullWidth
            error={newEvent.apellidoClient !== '' && !/^[A-Za-z\s]+$/.test(newEvent.apellidoClient)}
            helperText={newEvent.apellidoClient !== '' && !/^[A-Za-z\s]+$/.test(newEvent.apellidoClient) ? 'No se permiten números' : ''}
            sx={{ marginBottom: 2 }}
          />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <h6 style={{ margin: '0', marginRight: '8px' }}>Fecha Nacimiento</h6>
              <TextField
                type="date"
                value={newEvent.fechaNacimiento}
                onChange={(e) => setNewEvent({ ...newEvent, fechaNacimiento: e.target.value })}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
            </div>
            <TextField
              type="number"
              label="DPI"
              value={newEvent.dpi}
              onChange={handleDpiChange}
              fullWidth
              error={newEvent.dpi !== '' && !/^\d+$/.test(newEvent.dpi)}
              helperText={newEvent.dpi !== '' && !/^\d+$/.test(newEvent.dpi) ? 'Solo se permiten números' : ''}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              select
              label="Estado Civil"
              value={newEvent.estadoCivil}
              onChange={handleEstadoCivilChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            >
              {estadosCiviles.map((estadoCivil) => (
                <MenuItem key={estadoCivil} value={estadoCivil}>
                  {estadoCivil}
                </MenuItem>
              ))}
            </TextField>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <h5 style={{ margin: '0', marginRight: '16px' }}>Esta Trabajando?</h5>
              <RadioGroup
                aria-label="Trabajando"
                name="trabajando"
                value={newEvent.trabajando}
                onChange={handleTrabajandoChange}
                row
                sx={{ marginBottom: 2 }}
              >
                <FormControlLabel value="Si" control={<Radio />} label="Si" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </div>
            <TextField
              type="number"
              label="Cantidad de Hijos"
              value={newEvent.cantidadHijos}
              onChange={handleCantidadHijosChange}
              fullWidth
              error={newEvent.cantidadHijos !== '' && !/^\d+$/.test(newEvent.cantidadHijos)}
              helperText={newEvent.cantidadHijos !== '' && !/^\d+$/.test(newEvent.cantidadHijos) ? 'Solo se permiten números' : ''}
              sx={{ marginBottom: 2 }}
            />
          </div>
          {/* Botones */}
          <Button onClick={createEvent} variant="contained" color="primary" sx={{ marginRight: 2 }}>
            Nuevo Cliente
          </Button>
          <Button onClick={closeNewEventModal} variant="contained">
            Cancelar
          </Button>
        </Modal>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} onDeleteSelected={deleteSelected} selected={selected} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={clientes.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                  showCheckbox
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      idCliente,
                      nameClient,
                      apellidoClient,
                      dpi,
                      estadoCivil,
                      trabajando,
                      cantidadHijos,
                    } = row;
                    const selectedUser = selected.indexOf(nameClient) !== -1;

                    return (
                      <TableRow key={idCliente} hover tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, nameClient)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={nameClient} />
                            <Typography variant="subtitle2">{nameClient}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{apellidoClient}</TableCell>
                        <TableCell align="left">{dpi}</TableCell>
                        <TableCell align="left">{estadoCivil}</TableCell>
                        <TableCell align="left">{trabajando}</TableCell>
                        <TableCell align="left">{cantidadHijos}</TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={8} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
                        <Paper sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" paragraph>
                            No encontrado
                          </Typography>
                          <Typography variant="body2">
                            No se encontraron resultados para &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Intenta verificar errores tipográficos o usar palabras completas.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={clientes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          {/* Iconify y resto del código */}
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          {/* Iconify y resto del código */}
        </MenuItem>
      </Popover>
    </>
  );
}
