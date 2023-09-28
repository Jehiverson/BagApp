import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button, Container, Stack, Typography, TableContainer, TablePagination, Table, TableBody, TableRow, TableCell, Card, Paper, Checkbox, Input, InputAdornment, Button as MUIButton } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import Grid from '@mui/material/Grid';
import { sentenceCase } from 'change-case';
import moment from 'moment';
import 'moment/locale/es';
import 'moment-timezone';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import Label from '../components/label';
import { UserListToolbar } from '../sections/@dashboard/blog';
import Scrollbar from '../components/scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import Iconify from '../components/iconify';
import { obtenerActividades, handleUpdateActivityStatus, eliminarDato } from '../api/actividadApi';
import {FormCambioEvento} from '../components/formulario/formCambioEvento';
import { FormPago } from '../components/formulario/formPago';
import { FormActualizarEvento } from '../components/formulario/formActualizarEvento';
import { FormIngresarActividad } from '../components/formulario/formIngresarActividad';

moment.locale('es'); // Establece el idioma si lo deseas
moment.tz.setDefault('America/Guatemala'); // Establece la zona horaria local

const TABLE_HEAD = [
  { id: 'idActividad', label: 'N°', alignRight: false },
  { id: 'nombreActividad', label: 'Nombre', alignRight: false },
  { id: 'descripcionActividad', label: 'Descripcion', alignRight: false },
  { id: 'fechaEntrega', label: 'Entrega', alignRight: false },
  { id: 'estadoActividad', label: 'Estado', alignRight: false },
  { id: 'fechaInicio', label: 'Inicia', alignRight: false },
  { id: 'fechaFinal', label: 'Finaliza', alignRight: false },
  { id: 'idPago', label: 'Pago', alignRight: false },
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
    return array.filter((_user) => _user && _user.nombreActividad.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
const StyledInput = styled(Input)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '4px',
  border: '1px solid #ccc',
  padding: theme.spacing(1),
  marginRight: theme.spacing(1),
  flex: 1,
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${theme.palette.primary.light}`,
  },
}));

const StyledButton = styled(MUIButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));
export default function Actividad() {
  const [actividadData, setactividadData] = useState([]);
  const [orderBy, setOrderBy] = useState('nombre');
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [showForm, setShowForm] = useState(false);
  const localStorageUser = JSON.parse(localStorage.getItem('user'));
  const role = localStorageUser ? localStorageUser.tipoRol : null;
  const [apiCalled, setApiCalled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  Modal.setAppElement('#root');
  const localizer = momentLocalizer(moment);
  const messages = {
    today: 'Hoy',
    next: 'Siguiente',
    previous: 'Regresar',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
  };
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showActualizar, setShowActualizar] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openNewEventModal = () => {
    setIsModalOpen(true);
  };

  const closeNewEventModal = () => {
    setIsModalOpen(false);
  };

  const getRandomColor = () => {
    const colors = ['blue', 'green', 'red', 'orange', 'purple', 'pink', 'teal'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }; 
  
  const fetchEvents = async () => {
    try {
      const response = await obtenerActividades();
      const filteredEvents = response.data
        .filter((event) => {
          if (role === 'Administrador' || role === 'Usuario') {
            return true; // Mostrar todas las actividades para el rol de Administrador
          }
          if (role === 'Cliente') {
            const currentDate = moment().tz('America/Guatemala');
            const endDate = moment.utc(event.fechaFinal).tz('America/Guatemala');
            return endDate.isAfter(currentDate);
          }
          return false;
        })
        .map((event) => ({
          idActividad: event.idActividad,
          title: event.nombreActividad,
          descripcionActividad: event.descripcionActividad,
          fechaEntrega: event.fechaEntrega,
          estado: event.estadoActividad,
          precioActividad: event.precioActividad,
          lugarActividad: event.lugarActividad,
          fechaInicio: moment.utc(event.fechaInicio).tz('America/Guatemala').toDate(),
          fechaFinal: moment.utc(event.fechaFinal).tz('America/Guatemala').toDate(),
          idCliente: event.idCliente,
          backgroundColor: getRandomColor(),
        }));
      setEvents(filteredEvents);
      setactividadData(response.data);
      
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };  
  
  useEffect(() => {
    if (!apiCalled) {
      fetchEvents();
      setApiCalled(true);
    }
  }, [apiCalled]);

  // No Tocar ni eliminar
  const deleteEvent = async (idActividad) => {
    try {
      console.log(idActividad);
      await eliminarDato(idActividad);
      fetchEvents();
      setSelectedEvent(null);
      toast.success('Actividad Eliminada');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Error al eliminar la Actividad');
    }
  };
  const handleCalendarNavigate = (newDate) => {
    setSelectedDate(newDate);
  };
  
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      // Si el término de búsqueda está vacío, no hacemos nada
      return;
    }
  
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
    // Buscamos eventos que coincidan con el término de búsqueda en el nombre
    const matchingEvents = events.filter((event) =>
      event.title.toLowerCase().includes(lowerCaseSearchTerm)
    );
  
    if (matchingEvents.length > 0) {
      // Si se encontraron eventos coincidentes, ajustamos la vista del calendario
      const startDate = moment(matchingEvents[0].fechaInicio); // Tomamos la fecha de inicio del primer evento coincidente
      setSelectedDate(startDate.toDate()); // Establecemos la fecha seleccionada
    }
  };  
  
  const updateActivityStatus = async () => {
    if (selected.length === 1) {
      const selectedId = selected[0];

      try {
        await handleUpdateActivityStatus(selectedId, { estadoActividad: 'Completa' }, actividadData, setactividadData);
        setSelected([]);
        toast.success("Actividad Entregadas");
      } catch (error) {
        console.error('Error updating activity status:', error);
        toast.error("Error al actualizar Actividad");
      }
    }
  };

  const selectEvent = (event) => {
    setSelectedEvent(event);
  };
  const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
  };
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(actividadData.map((actividadData) => actividadData.idActividad));
    } else {
      setSelected([]);
    }
  };
  const handleClick = (event, name) => {
    console.log('Clicked activity ID:', name); // Agrega este console.log
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
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - actividadData.length) : 0;
  const filteredUsers = applySortFilter(actividadData, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Actividades</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Actividades
          </Typography>
          {role === 'Administrador' ? (
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={openNewEventModal}>
              Nueva Actividad
            </Button>    
          ) : null}
        </Stack>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeNewEventModal}
          style={{
            overlay: {
              zIndex: 1000,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            content: {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '8px',
              padding: '30px',
              width: '90%', // Usar el 90% del ancho disponible
              maxWidth: '750px', // Establecer un ancho máximo
              maxHeight: '90vh', // Usar el 90% de la altura visible
              overflow: 'auto', // Agregar desplazamiento si el contenido es demasiado largo
            },
          }}
        >
          <div className="modal-content">
            <FormIngresarActividad closeNewEventModal={closeNewEventModal} fetchEvents={fetchEvents} />
          </div>
        </Modal>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <StyledInput
            type="text"
            placeholder="Buscar actividad por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />
          <StyledButton variant="contained" onClick={handleSearch}>
            Buscar
          </StyledButton>
        </div>

        <Calendar
          localizer={localizer}
          events={events}
          messages={messages}
          defaultDate={new Date()}
          startAccessor="fechaInicio"
          endAccessor="fechaFinal"
          style={{ height: 500 }}
          onSelectEvent={selectEvent}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.backgroundColor,
            },
          })}
          date={selectedDate} // Asegúrate de pasar el estado selectedDate aquí
          onNavigate={handleCalendarNavigate}
        />

        {role === 'Administrador' ? (
        <Card style={{marginTop: 20, height: 250, alignItems: 'center', p: 3, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', backgroundColor: 'white'}}>
            <div style={{marginTop: 25}}>
              <FormCambioEvento />
            </div>
        </Card>
         ) : null} 
        {role === 'Administrador' ? (
          <Typography variant="h4" gutterBottom style={{ margin: '10px' }}>
            Listado de Actividades con Pago
          </Typography>
        ) : null} 
        {role === 'Administrador' ? (
          <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} onDeleteSelected={updateActivityStatus} selected={selected}  />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={actividadData.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAll}
                    showCheckbox
                  />
                <TableBody>
                  {filteredUsers
                  .filter(row => row.idPago !== null && row.idPago !== "")
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const {
                      idActividad,
                      nombreActividad,
                      descripcionActividad,
                      fechaEntrega,
                      estadoActividad,
                      fechaInicio,
                      fechaFinal,
                      idPago,
                    } = row;
                    const selectedUser = selected.indexOf(idActividad) !== -1;
                    return (
                      <TableRow key={idActividad} hover tabIndex={-1} role="checkbox" selected={selectedUser} >
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, idActividad)} />
                        </TableCell>
                        <TableCell align="left">{idActividad}</TableCell>
                        <TableCell align="left">{nombreActividad}</TableCell>
                        <TableCell align="left">{descripcionActividad}</TableCell>
                        <TableCell align="left">{moment.utc(fechaEntrega).tz('America/Guatemala').format('YYYY-MM-DD')}</TableCell>
                        <TableCell align="left">
                          {estadoActividad === 'Pendiente' ? (
                            <Label color="error">{sentenceCase(estadoActividad)}</Label>
                          ) : (
                            <Label color="success">{sentenceCase(estadoActividad)}</Label>
                          )}
                        </TableCell>
                        <TableCell align="left">{moment.utc(fechaInicio).tz('America/Guatemala').format('YYYY-MM-DD')}</TableCell>
                        <TableCell align="left">{moment.utc(fechaFinal).tz('America/Guatemala').format('YYYY-MM-DD')}</TableCell>
                        <TableCell align="left">{idPago}</TableCell>
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
            count={actividadData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        ) : null} 

        {selectedEvent && (
          <Modal 
            isOpen
            onRequestClose={() => setSelectedEvent(null)}
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
                maxWidth: '90%', // Cambia el valor de maxWidth a '90%'
                width: 'auto', // Establece el ancho en automático
              },
            }}
          >
            {role === 'Administrador' ? (
              <div>
              <div style={{marginTop: 15}}>
                <Button
                  variant='contained'
                  color='info'
                  onClick={() => setShowActualizar(!showActualizar)}
                  startIcon={<EditIcon />}
                  style={{marginRight: 15}}
                >
                  Actualizar Evento
                </Button>
                <Button
                  variant='contained'
                  color='error'
                  onClick={() => deleteEvent(selectedEvent.idActividad)}
                  startIcon={<DeleteIcon />}
                >
                  Eliminar Evento
                </Button>
              </div>
              <br />
              {showActualizar ? (
                <div style={{marginTop: 15}}>
                  <Typography variant='h6'>Actualizar Datos de la Actividad</Typography>
                  <FormActualizarEvento selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} fetchEvents={fetchEvents} />
                </div>
              ) : null}
            </div>
            ) : null}
            {role === 'Cliente' || role === 'Usuario' || role === 'Administrador' ? (
              <div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '16px', background: '#f5f5f5' }}>
                      <Typography variant='h6' style={{ color: '#333', marginBottom: '8px' }}>
                        {selectedEvent.title}
                      </Typography>
                      <Typography variant='body1' style={{ color: '#555' }}>
                        {selectedEvent.descripcionActividad}
                      </Typography>
                      <Typography variant='body1' style={{ color: '#555' }}>
                      <span style={{ fontWeight: 'bold' }}>Este: </span>{convertirFechaAC(selectedEvent.fechaEntrega)}
                      </Typography>
                      <Typography variant='body1' style={{ color: '#555' }}>
                      <span style={{ fontWeight: 'bold' }}>Precio de Entrada: </span>Q{selectedEvent.precioActividad}
                      </Typography>
                      <Typography variant='body1' style={{ color: '#555' }}>
                      <span style={{ fontWeight: 'bold' }}>Lugar de Actividad: </span>{selectedEvent.lugarActividad}
                      </Typography>
                    </Paper>
                  </Grid>
                  {role === 'Administrador' ? (
                    <Grid item xs={12}>
                      <Button
                        variant='contained'
                        color='primary' // Color primario de Material-UI
                        onClick={() => setShowForm(!showForm)}
                      >
                        {showForm ? 'Cancelar Compra' : 'Comprar Boleto'}
                      </Button>
                    </Grid>
                  ) : null} 
                </Grid>
              </div>
            ) : null}
            {showForm && (
              <FormPago idActividad={selectedEvent.idActividad} setSelectedEvent={setSelectedEvent} />
            )}
          </Modal>
        )}

      </Container>
    </>
  );
  // Función para convertir una fecha UTC a la fecha local de América Central
  function convertirFechaAC(fechaUTC) {
    const fechaLocal = new Date(fechaUTC);
    const options = { timeZone: 'America/El_Salvador', year: 'numeric', month: 'numeric', day: 'numeric' };
    return fechaLocal.toLocaleString(undefined, options);
  }
}