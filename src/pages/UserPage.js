import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Card, Table, Stack, Paper, Button, Popover, Checkbox, TableRow, MenuItem, TableBody, TableCell, Container, Typography, IconButton, TableContainer, TablePagination, TextField, } from '@mui/material';
import Modal from 'react-modal';
import moment from 'moment'; // Cambia la importación de moment
import 'moment/locale/es'; // Importa el idioma si lo deseas
import 'moment-timezone';
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
      const localStart = moment(newEvent.fechaInicio).tz('UTC').format('YYYY-MM-DD'); // Convertir a UTC y quitar la hora
      await axios.post('http://localhost:5000/bagapp-5a770/us-central1/app/api/actividades', {
        ...newEvent,
        fechaNacimiento: localStart,
      });
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
    } catch (error) {
      console.error('Error creating event:', error);
    }
  }; 
  const handleEditClick = () => {
    setIsEditar(true);
  };
  const handleCancelEdit = () => {
    setIsEditar(false);
  };
  const handleUpdateClient = () => {
    axios.put(`http://localhost:5000/bagapp-5a770/us-central1/app/api/clientes/${selectedClient.idCliente}`, selectedClient)
      .then(response => {
        // Handle success if needed
      })
      .catch(error => {
        console.error('Error al actualizar el cliente:', error);
      });
    setIsEditar(false);
  };
  const handleFieldChange = (fieldName, value) => {
    setSelectedClient(prevClient => ({
      ...prevClient,
      [fieldName]: value
    }));
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
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
              onChange={(e) => setNewEvent({ ...newEvent, nameClient: e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              type="text"
              label="Apellido"
              value={newEvent.apellidoClient}
              onChange={(e) => setNewEvent({ ...newEvent, apellidoClient: e.target.value })}
              fullWidth
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
              type="text"
              label="DPI"
              value={newEvent.dpi}
              onChange={(e) => setNewEvent({ ...newEvent, dpi: e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              type="text"
              label="Estado Civil"
              value={newEvent.estadoCivil}
              onChange={(e) => setNewEvent({ ...newEvent, estadoCivil: e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            
            <TextField
              type="number"
              label="Cantidad de Hijos"
              value={newEvent.cantidadHijos}
              onChange={(e) => setNewEvent({ ...newEvent, cantidadHijos: e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
          </div>
          {/* Botones */}
          <Button onClick={createEvent} variant="contained" color="primary" sx={{ marginRight: 2 }}>
            Crear Evento
          </Button>
          <Button onClick={closeNewEventModal} variant="contained">
            Cancelar
          </Button>
        </Modal>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

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
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      idCliente,
                      nameClient,
                      apellidoClient,
                      DPI,
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
                        <TableCell align="left">{DPI}</TableCell>
                        <TableCell align="left">{estadoCivil}</TableCell>
                        <TableCell align="left">{trabajando}</TableCell>
                        <TableCell align="left">{cantidadHijos}</TableCell>
                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            {/* Iconify y resto del código */}
                          </IconButton>
                        </TableCell>
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
      <br />
      <Card sx={{ p: 3, boxShadow: 3, backgroundColor: 'white' }}>
        <Typography variant='h5'>Informacion Personal</Typography>
        {selectedClient && (
          <div>
            {isEditar ? (
              <>
                <TextField
                  value={selectedClient.nameClient}
                  onChange={(e) => handleFieldChange('nameClient', e.target.value)}
                />
                <TextField
                  value={selectedClient.apellidoClient}
                  onChange={(e) => handleFieldChange('apellidoClient', e.target.value)}
                />
                {/* Repeat similar TextField components for other fields */}
                <Button onClick={handleUpdateClient}>Guardar Cambios</Button>
                <Button onClick={handleCancelEdit}>Cancelar</Button>
              </>
            ) : (
              <>
                <Typography variant='h6'>{selectedClient.nameClient}</Typography>
                <Typography variant='h6'>{selectedClient.apellidoClient}</Typography>
                {/* Repeat similar Typography components for other fields */}
                <Button onClick={handleEditClick}>Editar</Button>
              </>
            )}
          </div>
        )}
      </Card>
    </>
  );
}
