import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Card, Table, Stack, Paper, Button, Checkbox, TableRow, MenuItem, TableBody, TableCell, Container, Typography, TableContainer, TablePagination, TextField, RadioGroup, Radio, FormControlLabel, IconButton, } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ReactModal from 'react-modal';
import moment from 'moment';
import 'moment/locale/es';
import 'moment-timezone';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

const TABLE_HEAD = [
  { id: 'nameClient', label: 'Nombre', alignRight: false },
  { id: 'apellidoClient', label: 'Apellido', alignRight: false },
  { id: 'fechaNacimiento', label: 'Fecha de Nacimiento', alignRight: false},
  { id: 'DPI', label: 'DPI', alignRight: false },
  { id: 'estadoCivil', label: 'Estado Civil', alignRight: false },
  { id: 'trabajando', label: 'Trabaja', alignRight: false },
  { id: 'cantidadHijos', label: 'Cantidad de Hijos', alignRight: false },
  { id: 'Editar', label: 'Editar', alignRight: false }, 
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
// Función para obtener la lista de clientes
export const fetchClientes = (setClientes) => {
  axios.get('http://localhost:5000/bagapp-5a770/us-central1/app/api/clientes')
    .then(response => {
      setClientes(response.data);
    })
    .catch(error => {
      console.error('Error al obtener los datos de los clientes:', error);
    });
};
export const handleDeleteSelected = async (selectedClients, clientes, setClientes) => {
  try {
    // Obtener los IDs de los clientes seleccionados
    const selectedIds = selectedClients.map(cliente => cliente.idCliente);

    // Enviar una petición DELETE para eliminar los registros
    await Promise.all(selectedIds.map(idCliente =>
      axios.delete(`http://localhost:5000/bagapp-5a770/us-central1/app/api/clientes/${idCliente}`)
    ));

    // Actualizar la lista de clientes después de eliminar
    fetchClientes(setClientes);

    // Mostrar notificación de éxito
    toast.success('Clientes eliminados exitosamente');
  } catch (error) {
    console.error('Error al eliminar los registros:', error);
    // Mostrar notificación de error
    toast.error('Error al eliminar los clientes');
  }
};

export default function UserPage() {
  ReactModal.setAppElement('#root'); 
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('nameClient');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [clientes, setClientes] = useState([]);
  const targetClientId = 75893;
  const [childrenAges, setChildrenAges] = useState([]);
  const [isNewEventModalOpen, setNewEventModalOpen] = useState(false);
  const [abrirModal, setAbrirModal] = useState(false);
  const [seleccionar, setSeleccionar] = useState(null);
  const [newEvent, setNewEvent] = useState({
    nameClient: '',
    apellidoClient: '',
    fechaNacimiento: '',
    dpi: '',
    telefono: '',
    genero: '',
    estadoCivil: '',
    trabajando: 'No',
    ocupacion: '',
    direccion: '',
    cantidadHijos: ''
  });
  // onChange para Insertar Clientes
  const handleEstadoCivilChange = (event) => {
    setNewEvent(prevEvent => ({ ...prevEvent, estadoCivil: event.target.value }));
  };
  const handleTrabajandoChange = (event) => {
    setNewEvent(prevEvent => ({ ...prevEvent, trabajando: event.target.value }));
  };
  const handleNameChange = (e) => {
    const inputValue = e.target.value;
    if (/^[A-Za-z\s]+$/.test(inputValue) || inputValue === '') {
      setNewEvent(prevEvent => ({ ...prevEvent, nameClient: inputValue }));
    }
  };
  const handleApellidoChange = (e) => {
    const inputValue = e.target.value;
    if (/^[A-Za-z\s]+$/.test(inputValue) || inputValue === '') {
      setNewEvent(prevEvent => ({ ...prevEvent, apellidoClient: inputValue }));
    }
  };
  const handleDpiChange = (e) => {
    const inputValue = e.target.value;
    if (/^\d+$/.test(inputValue) || inputValue === '') {
      setNewEvent(prevEvent => ({ ...prevEvent, dpi: inputValue }));
    }
  };
  const handleTelefonoChange = (e) => {
    const inputValue = e.target.value;
    if (/^\d+$/.test(inputValue) || inputValue === '') {
      setNewEvent(prevEvent => ({ ...prevEvent, telefono: inputValue }));
    }
  };
  const handleGeneroChange = (event) => {
    setNewEvent(prevEvent => ({ ...prevEvent, genero: event.target.value }));
  };
  const handleOcupacionChange = (e) => {
    const inputValue = e.target.value;
    if (/^[A-Za-z\s]+$/.test(inputValue) || inputValue === '') {
      setNewEvent(prevEvent => ({ ...prevEvent, ocupacion: inputValue }));
    }
  };
  const handleDireccionChange = (e) => {
    const inputValue = e.target.value;
    if (/^[A-Za-z0-9\s\W]+$/.test(inputValue) || inputValue === '') {
      setNewEvent((prevEvent) => ({ ...prevEvent, direccion: inputValue }));
    }
  };  
  const handleCantidadHijosChange = (e) => {
    const inputValue = e.target.value;
    if (/^\d+$/.test(inputValue) || inputValue === '') {
      const numChildren = parseInt(inputValue, 10); // Agrega la base numérica 10
      setNewEvent(prevEvent => ({ ...prevEvent, cantidadHijos: numChildren }));
      setChildrenAges(Array(numChildren).fill(''));
    }
  };
  // onChange para Editar Clientes
  const handleFieldChange = (fieldName, value) => {
    setSeleccionar(prevSeleccionar => ({
      ...prevSeleccionar,
      [fieldName]: value,
    }));
  };
  // Actualizar el estado civil
  const handleEstadoCivilChangeSelec = (event) => {
    const newStateCivil = event.target.value;
    setSeleccionar(prevSeleccionar => ({
      ...prevSeleccionar,
      estadoCivil: newStateCivil,
    }));
  };
  useEffect(() => {
    fetchClientes(setClientes);
  }, []);
  // Función para buscar el cliente con el ID deseado
  const findClientById = (clientId) => {
    return clientes.find((cliente) => cliente.idCliente === clientId);
  };
  // Obtén el cliente con el ID deseado
  const targetClient = findClientById(targetClientId);

  const createEvent = async () => {
    try {
      const localStart = moment(newEvent.fechaNacimiento).tz('UTC').format('YYYY-MM-DD'); // Convertir a UTC y quitar la hora
      const response = await axios.post('http://localhost:5000/bagapp-5a770/us-central1/app/api/clientes', {
        ...newEvent,
        fechaNacimiento: localStart,
      });
      closeNewEventModal();
      setNewEvent({
        nameClient: '',
        apellidoClient: '',
        fechaNacimiento: '',
        dpi: '',
        telefono: '',
        genero:  '',
        estadoCivil: '',
        trabajando: '',
        ocupacion: '',
        direccion: '',
        cantidadHijos: '',
      });
      // Insertar edades de hijos solo si hay hijos
      if (newEvent.cantidadHijos > 0) {
        const clientId = response.data.idCliente; // Obtener el ID del cliente creado
        const childrenData = childrenAges.map((edad, index) => ({ idHijo: index + 1, idCliente: clientId, edad })); // Asignar un idHijo basado en el índice
        await axios.post('http://localhost:5000/bagapp-5a770/us-central1/app/api/hijo', { childrenData }); // Enviar un objeto con la propiedad childrenData
      }
      setChildrenAges([]);
      // Actualizar la lista de clientes después de crear un nuevo evento
      fetchClientes(setClientes);
      // Mostrar notificación de éxito
      toast.success('Cliente creado exitosamente');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error("Cliente no registrado");
    }
  }; 
  const deleteSelected = () => {
    if (selected.length > 0) {
      const selectedClients = selected.map(selectedId => clientes.find(cliente => cliente.idCliente === selectedId));
      handleDeleteSelected(selectedClients, clientes, setClientes);
      setSelected([]);
    }
  };
  // Función para actualizar el cliente
  const updateEvent = async () => {
    try {
      await axios.put(`http://localhost:5000/bagapp-5a770/us-central1/app/api/clientes/${seleccionar.idCliente}`, {
        ...seleccionar,
      });
      handleCloseModal();
      // Actualizar la lista de clientes después de actualizar un evento
      fetchClientes(setClientes);
      // Mostrar notificación de éxito
      toast.success('Cliente actualizado exitosamente');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Error al actualizar el cliente');
    }
  };     

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(clientes.map((cliente) => cliente.idCliente));
    } else {
      setSelected([]);
    }
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
  const handleOpenModal = (userData) => {
    setSeleccionar(userData);
    setAbrirModal(true);
  };
  // Función para cerrar el modal
  const handleCloseModal = () => {
    setSeleccionar(null);
    setAbrirModal(false);
  };
  const handleChildAgeChange = (e, index) => {
    const newChildrenAges = [...childrenAges];
    newChildrenAges[index] = e.target.value;
    setChildrenAges(newChildrenAges);
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
        {/* Modal para Insertar Clientes */}
        <ReactModal
          isOpen={isNewEventModalOpen}
          onRequestClose={closeNewEventModal}
          style={{
            overlay: {
              zIndex: 1000,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            content: {
              // Resto de tus estilos
              width: '60%', // Reduce el ancho del modal al 60% del ancho de la ventana
              maxHeight: '80%', // Limita la altura máxima del modal al 80% del alto de la ventana
              overflow: 'auto', // Agrega un scrollbar si es necesario

              // El resto de tus estilos se mantiene igual
              top: '50%', // Center the modal vertically
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              transform: 'translate(-50%, -50%)',
              borderRadius: '8px',
              padding: '20px',
              maxWidth: '800px',
              margin: 'auto',
              marginTop: '35px',
              marginBottom: '20px',
              marginLeft: '20px',
              marginRight: '20px',
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
              type="number"
              label="Telefono"
              value={newEvent.telefono}
              onChange={handleTelefonoChange}
              fullWidth
              error={newEvent.telefono !== '' && !/^\d+$/.test(newEvent.telefono)}
              helperText={newEvent.telefono !== '' && !/^\d+$/.test(newEvent.telefono) ? 'Solo se permiten números' : ''}
              sx={{ marginBottom: 2 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <h5 style={{ margin: '0', marginRight: '16px' }}>Genero:</h5>
              <RadioGroup
                aria-label="Genero"
                name="genero"
                value={newEvent.genero}
                onChange={handleGeneroChange}
                row
                sx={{ marginBottom: 2 }}
              >
                <FormControlLabel value="F" control={<Radio />} label="F" />
                <FormControlLabel value="M" control={<Radio />} label="M" />
                <FormControlLabel value="otro" control={<Radio />} label="Otro" />
              </RadioGroup>
            </div>
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
            {newEvent.trabajando === 'Si' && (
              <TextField
                type="text"
                label="Ocupacion"
                value={newEvent.ocupacion}
                onChange={handleOcupacionChange}
                fullWidth
                error={newEvent.ocupacion !== '' && !/^[A-Za-z\s]+$/.test(newEvent.ocupacion)}
                helperText={newEvent.ocupacion !== '' && !/^[A-Za-z\s]+$/.test(newEvent.ocupacion) ? 'No se permiten números' : ''}
                sx={{ marginBottom: 2 }}
              />
            )}
            <TextField
              type="text"
              label="Direccion"
              value={newEvent.direccion}
              onChange={handleDireccionChange}
              fullWidth
              error={newEvent.direccion !== '' && !/^[A-Za-z\s]+$/.test(newEvent.direccion)}
              helperText={newEvent.direccion !== '' && !/^[A-Za-z\s]+$/.test(newEvent.direccion)}
              sx={{ marginBottom: 2 }}
            />
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
          {newEvent.cantidadHijos > 0 && (
            <div>
              {[...Array(newEvent.cantidadHijos)].map((_, index) => (
                <div key={index}>
                  <TextField
                    type="number"
                    label={`Edad del Hijo ${index + 1}`}
                    value={childrenAges[index] || ''}
                    onChange={(e) => handleChildAgeChange(e, index)}
                    fullWidth
                    // ...
                  />
                </div>
              ))}
            </div>
          )}
            <br />
          {/* Botones */}
          <Button onClick={createEvent} variant="contained" color="primary" sx={{ marginRight: 2 }}>
            Nuevo Cliente
          </Button>
          <Button onClick={closeNewEventModal} variant="contained">
            Cancelar
          </Button>
        </ReactModal>
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
                  onSelectAllClick={handleSelectAll}
                  showCheckbox
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      idCliente,
                      nameClient,
                      apellidoClient,
                      fechaNacimiento,
                      dpi,
                      estadoCivil,
                      trabajando,
                      cantidadHijos,
                    } = row;
                    const selectedUser = selected.indexOf(idCliente) !== -1;

                    return (
                      <TableRow key={idCliente} hover tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, idCliente)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={nameClient} />
                            <Typography variant="subtitle2">{nameClient}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{apellidoClient}</TableCell>
                        <TableCell align="left">{moment.utc(fechaNacimiento).tz('America/Guatemala').format('YYYY-MM-DD')}</TableCell>
                        <TableCell align="left">{dpi}</TableCell>
                        <TableCell align="left">{estadoCivil}</TableCell>
                        <TableCell align="left">{trabajando}</TableCell>
                        <TableCell align="left">{cantidadHijos}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenModal(row)}> {/* Agrega evento onClick */}
                            <EditIcon /> {/* Puedes usar un ícono de edición o similar */}
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
        {/* Modal para Actualizar Clientes */}
        <ReactModal
          isOpen={abrirModal}
          onRequestClose={handleCloseModal}
          style={{
            overlay: {
              zIndex: 1000,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              transform: 'translate(-50%, -50%)',
              borderRadius: '8px',
              padding: '20px',
              width: '80%',
              maxWidth: '800px',
              maxHeight: '90%',
              margin: 'auto',
              overflow: 'auto',
              marginTop: '35px',
              marginBottom: '20px',
              marginLeft: '20px',
              marginRight: '20px',
            },
          }}
        >
          <div>
            <TextField
              type="text"
              label="Nombre"
              value={seleccionar ? seleccionar.nameClient : ''}
              fullWidth
              onChange={(event) => handleFieldChange('nameClient', event.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              type="text"
              label="Apellido"
              value={seleccionar ? seleccionar.apellidoClient : ''}
              fullWidth
              onChange={(event) => handleFieldChange('apellidoClient', event.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <h6 style={{ margin: '0', marginRight: '8px' }}>Fecha Nacimiento</h6>
              <TextField
                type="date"
                value={seleccionar ? seleccionar.fechaNacimiento : ''}
                onChange={(event) => handleFieldChange('fechaNacimiento', event.target.value)}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
            </div>
            <TextField
              type="text"
              label="DPI"
              value={seleccionar ? seleccionar.dpi : ''}
              fullWidth
              onChange={(event) => handleFieldChange('dpi', event.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              select
              label="Estado Civil"
              value={seleccionar ? seleccionar.estadoCivil : ''}
              onChange={handleEstadoCivilChangeSelec}
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
                value={seleccionar ? seleccionar.trabajando : ''}
                onChange={(event) => handleFieldChange('trabajando', event.target.value)}
                row
                sx={{ marginBottom: 2 }}
              >
                <FormControlLabel value="Si" control={<Radio />} label="Si" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </div>
            <TextField
              type="text"
              label="Cantidad de Hijos"
              value={seleccionar ? seleccionar.cantidadHijos : ''}
              fullWidth
              onChange={(event) => handleFieldChange('cantidadHijos', event.target.value)}
              sx={{ marginBottom: 2 }}
            />
            {/* Botones */}
            <Button onClick={updateEvent} variant="contained" color="primary" sx={{ marginRight: 2 }}>
              Actualizar Cliente
            </Button>
            <Button onClick={handleCloseModal} variant="contained">
              Cancelar
            </Button>
          </div>
        </ReactModal>
        <br />
        <Typography variant="h4" gutterBottom>Cliente</Typography>
        <div>
          {targetClient && (
            <Card sx={{ padding: '16px' }}>
              <div>
                <Typography variant="h4" gutterBottom>
                  {targetClient.idCliente}
                </Typography>
                <Typography variant="body1">
                  Nombre del Cliente: {targetClient.nameClient}
                </Typography>
                <Typography variant="body1">
                  Apellido del Cliente: {targetClient.apellidoClient}
                </Typography>
                <Typography variant="body1">
                  Fecha de Nacimiento: {targetClient.fechaNacimiento}
                </Typography>
                <Typography variant="body1">
                  DPI: {targetClient.dpi}
                </Typography>
                <Typography variant="body1">
                  Teléfono: {targetClient.telefono}
                </Typography>
                <Typography variant="body1">
                  Género: {targetClient.genero}
                </Typography>
                <Typography variant="body1">
                  Estado Civil: {targetClient.estadoCivil}
                </Typography>
                <Typography variant="body1">
                  Trabajando: {targetClient.trabajando}
                </Typography>
                <Typography variant="body1">
                  Ocupación: {targetClient.ocupacion}
                </Typography>
                <Typography variant="body1">
                  Cantidad de Hijos: {targetClient.cantidadHijos}
                </Typography>
                {/* Agrega más líneas para mostrar otros datos del cliente */}
              </div>
            </Card>
          )}
        </div>

      </Container>
    </>
  );
}
