import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Button, Container, Stack, Typography, TextField, TableContainer, TablePagination, Table, TableBody, TableRow, TableCell, Card, Paper, Checkbox, Tooltip } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { sentenceCase } from 'change-case';
import Select from 'react-select';
import moment from 'moment'; // Cambia la importación de moment
import 'moment/locale/es'; // Importa el idioma si lo deseas
import 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import Label from '../components/label';
import { UserListToolbar } from '../sections/@dashboard/blog';
import { handleUpdateActivityStatus } from '../sections/@dashboard/blog/api';
import Scrollbar from '../components/scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import Iconify from '../components/iconify';
// Configura la zona horaria local
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
  { id: 'idCliente', label: 'Cliente', alignRight: false },
  { id: 'idPago', label: 'Pago', alignRight: false },
  { id: 'idReporte', label: 'Reporte', alignRight: false },
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

export default function BlogPage() {
  const [actividadData, setactividadData] = useState([]);
  const [selectedPago, setSelectedPago] = useState(null);
  const [orderBy, setOrderBy] = useState('nombre');
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [nombreCliente, setNombreCliente] = useState('');
  const [clientesMap, setClientesMap] = useState(new Map());
  const [hoveredClientId, setHoveredClientId] = useState(null);
  const [cliente, setCliente] = useState('');
  const [actividades, setActividades] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  Modal.setAppElement('#root'); // Agrega esta línea
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isNewEventModalOpen, setNewEventModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newEvent, setNewEvent] = useState({
    nombreActividad: '',
    descripcionActividad: '',
    fechaEntrega: '',
    estadoActividad: 'Pendiente',
    fechaInicio: '',
    fechaFinal: ''
  });
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/bagapp-5a770/us-central1/app/api/actividades');
      const filteredEvents = response.data.map(event => ({
        id: event.idActividad,
        title: event.nombreActividad,
        description: event.descripcionActividad,
        entrega: event.fechaEntrega,
        estado: event.estadoActividad,
        start: moment(event.fechaInicio).toDate(),
        end: moment(event.fechaFinal).toDate(),
        cliente: event.idCliente,
      }));
      setEvents(filteredEvents); // Agregar esta línea para actualizar los eventos en el estado
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };  
  const fetchData = async () => {
    try {
      // Obtener los datos de actividades
      const actividadesResponse = await axios.get('http://localhost:5000/bagapp-5a770/us-central1/app/api/actividades');
      const actividadesData = actividadesResponse.data;

      // Obtener los nombres de los clientes y almacenarlos en un mapa para acceso rápido
      const idClientes = actividadesData.map(row => row.idCliente);
      const newClientesMap = new Map(); // Nuevo mapa para almacenar los nombres de los clientes

      // Realizar las llamadas a la API para obtener los nombres de los clientes
      await Promise.all(idClientes.map(async id => {
        try {
          const clienteResponse = await axios.get(`http://localhost:5000/bagapp-5a770/us-central1/app/api/clientes/${id}`);
          newClientesMap.set(id, clienteResponse.data.nameClient);
        } catch (error) {
          console.error('Error obteniendo el nombre del cliente:', error);
        }
      }));

      setClientesMap(newClientesMap); // Actualizar el estado de clientesMap

      // Actualizar los datos de actividades con los nombres de los clientes
      const actividadesConNombres = actividadesData.map(row => ({
        ...row,
        nombreCliente: newClientesMap.get(row.idCliente)
      }));
      setactividadData(actividadesConNombres);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  } 

  useEffect(() => {
    async function getActividades() {
      try {
        const response = await axios.get('http://localhost:5000/bagapp-5a770/us-central1/app/api/clientes');
        const clienteData = response.data;

        const actividadesFormatted = clienteData.map(actividad => ({
          value: actividad.idCliente,
          label: actividad.nameClient
        }));

        actividadesFormatted.unshift({
          value: 0,
          label: 'Seleccione un Cliente'
        });

        setCliente(actividadesFormatted);
      } catch (error) {
        console.error('Error al obtener las actividades:', error);
      }
    }
    axios.get('http://localhost:5000/bagapp-5a770/us-central1/app/api/actividades')
      .then(response => {
        setactividadData(response.data);
        setSelectedPago(response.data.find(pago => pago.idActividad === 1));
      })
      .catch(error => {
        console.error('Error al obtener los datos de los clientes:', error);
      });
    fetchData();
    getActividades();
    fetchEvents();
  }, []);
  const handleActividadChange = (selectedOption) => {
    setSelectedCliente(selectedOption);
  };  

  const createEvent = async () => {
    try {
      const formattedEvent = {
        ...newEvent,
        fechaEntrega: moment(newEvent.fechaEntrega).startOf('day').toISOString(),
        fechaInicio: moment(newEvent.fechaInicio).startOf('day').toISOString(),
        fechaFinal: moment(newEvent.fechaFinal).startOf('day').toISOString(),
        idCliente: selectedCliente.value // Usar el valor seleccionado del cliente
      };
  
      await axios.post('http://localhost:5000/bagapp-5a770/us-central1/app/api/actividades', formattedEvent);
  
      fetchEvents();
      closeNewEventModal();
      setNewEvent({
        nombreActividad: '',
        descripcionActividad: '',
        fechaEntrega: '',
        estadoActividad: 'Pendiente',
        fechaInicio: '',
        fechaFinal: ''
      });
      setSelectedCliente(null);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };  

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/bagapp-5a770/us-central1/app/api/actividades/${id}`);
      fetchEvents();
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };
  const updateActivityStatus = async () => {
    if (selected.length === 1) {
      const selectedId = selected[0];

      try {
        await handleUpdateActivityStatus(selectedId, { estadoActividad: 'Completa' }, actividadData, setactividadData);
        setSelected([]);
      } catch (error) {
        console.error('Error updating activity status:', error);
      }
    }
  };    

  const openNewEventModal = () => {
    setNewEventModalOpen(true);
  };

  const closeNewEventModal = () => {
    setNewEventModalOpen(false);
  };

  const selectEvent = (event) => {
    setSelectedEvent(event);
  };

  const customEventStyleGetter = (event) => ({
      style: {
        backgroundColor: 'blue',
      },
    });

  const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = actividadData.map((n) => n.nombreActividad);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={openNewEventModal}>
            Nueva Actividad
          </Button>
        </Stack>

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={selectEvent}
          eventPropGetter={customEventStyleGetter}
        />
        <br />
        <Card>
          <Typography variant="h4" gutterBottom style={{ margin: '10px' }}>
            Listado de Actividades con Pago
          </Typography>
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
                    onSelectAllClick={handleSelectAllClick}
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
                      idCliente,
                      idPago,
                      idReporte,
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
                        <TableCell align="left">
                          <Tooltip
                            title={hoveredClientId === idCliente ? clientesMap.get(idCliente) : ''}
                            placement="top"
                          >
                            <span
                              onMouseEnter={() => setHoveredClientId(idCliente)}
                              onMouseLeave={() => setHoveredClientId(null)}
                            >
                              {hoveredClientId === idCliente ? clientesMap.get(idCliente) : idCliente}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="left">{idPago}</TableCell>
                        <TableCell align="left">{idReporte}</TableCell>
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
              value={newEvent.nombreActividad}
              onChange={(e) => setNewEvent({ ...newEvent, nombreActividad: e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              type="text"
              label="Descripción"
              value={newEvent.descripcionActividad}
              onChange={(e) => setNewEvent({ ...newEvent, descripcionActividad: e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <h6 style={{ margin: '0', marginRight: '8px' }}>Fecha Entrega</h6>
              <TextField
                type="date"
                value={newEvent.fechaEntrega}
                onChange={(e) => setNewEvent({ ...newEvent, fechaEntrega: e.target.value })}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
            </div>
            <TextField
              type="text"
              label="Estado"
              value={newEvent.estadoActividad || "Pendiente"}
              onChange={(e) => setNewEvent({ ...newEvent, estadoActividad: e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
              disabled
              InputProps={{
                disableUnderline: true,
                style: { cursor: 'not-allowed' },
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <h6 style={{ margin: '0', marginRight: '8px' }}>Fecha Inicio</h6>
              <TextField
                type="date"
                value={newEvent.fechaInicio}
                onChange={(e) => setNewEvent({ ...newEvent, fechaInicio: e.target.value })}
                fullWidth
                sx={{ marginBottom: 0 }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <h6 style={{ margin: '0', marginRight: '8px' }}>Fecha Final</h6>
              <TextField
                type="date"
                value={newEvent.fechaFinal}
                onChange={(e) => setNewEvent({ ...newEvent, fechaFinal: e.target.value })}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
            </div>
            <Select
              value={selectedCliente}
              onChange={handleActividadChange}
              options={cliente}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <br />
          </div>
          {/* Botones */}
          <Button onClick={createEvent} variant="contained" color="primary" sx={{ marginRight: 2 }}>
            Crear Evento
          </Button>
          <Button onClick={closeNewEventModal} variant="contained">
            Cancelar
          </Button>
        </Modal>

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
                maxWidth: '600px',
                margin: 'auto',
              },
            }}
          >
            <h2>{isEditing ? (
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <h6 style={{ margin: '0', marginRight: '8px' }}>Nombre Actividad</h6>
                <TextField
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                  fullWidth
                />
              </div>
            ) : (
              selectedEvent.title
            )}</h2>
            <h3>{isEditing ? (
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <h6 style={{ margin: '0', marginRight: '8px' }}>Descripcion</h6>
                <TextField
                  value={selectedEvent.description}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
                  fullWidth
                />
              </div>
            ) : (
              selectedEvent.description
            )}</h3>
            <h3>
              {isEditing ? (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <h6 style={{ margin: '0', marginRight: '8px' }}>Fecha Entrega</h6>
                  <TextField
                    type="date"
                    value={moment(selectedEvent.entrega).format('YYYY-MM-DD')}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, entrega: e.target.value })}
                    fullWidth
                  />
                </div>
              ) : (
                moment(selectedEvent.entrega).format('YYYY-MM-DD')
              )}
            </h3>
            <h3>
              {isEditing ? (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <h6 style={{ margin: '0', marginRight: '8px' }}>Fecha Inicio</h6>
                  <TextField
                    type="date"
                    value={moment(selectedEvent.start).format('YYYY-MM-DD')}
                    onChange={(e) => setSelectedEvent({
                        ...selectedEvent,
                        start: moment(e.target.value).startOf('day').toISOString()
                      })
                    }
                    fullWidth
                  />
                </div>
              ) : (
                moment(selectedEvent.start).format('YYYY-MM-DD')
              )}
            </h3>
            <h3>
              {isEditing ? (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <h6 style={{ margin: '0', marginRight: '8px' }}>Fecha Final</h6>
                  <TextField
                    type="date"
                    value={moment(selectedEvent.end).format('YYYY-MM-DD')}
                    onChange={(e) => setSelectedEvent({
                      ...selectedEvent,
                      end: moment(e.target.value).startOf('day').toISOString()
                    })
                  }
                    fullWidth
                  />
                </div>
              ) : (
                moment(selectedEvent.end).format('YYYY-MM-DD')
              )}
            </h3>
            <h3>{isEditing ? (
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <h6 style={{ margin: '0', marginRight: '8px' }}>Cliente</h6>
                  <Select
                    value={selectedCliente}
                    onChange={handleActividadChange}
                    options={cliente}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                </div>
            ) : (
              selectedEvent.cliente
            )}</h3>
            <Button onClick={() => deleteEvent(selectedEvent.id)}>Eliminar Evento</Button>
            <Button onClick={() => setIsEditing(!isEditing)}>Actualizar Evento</Button>
          </Modal>
        )}
      </Container>
    </>
  );
}
