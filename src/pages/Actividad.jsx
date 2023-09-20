import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { Button, Container, FormControlLabel, Radio, Stack, Typography, RadioGroup, TextField, TableContainer, TablePagination, Table, TableBody, TableRow, TableCell, Card, Paper, Checkbox, } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { sentenceCase } from 'change-case';
import Select from 'react-select';
import moment from 'moment'; // Cambia la importación de moment
import 'moment/locale/es'; // Importa el idioma si lo deseas
import 'moment-timezone';
import {v4 as uuidv4} from 'uuid';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import Label from '../components/label';
import { UserListToolbar } from '../sections/@dashboard/blog';
import Scrollbar from '../components/scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import Iconify from '../components/iconify';
import ReportePDF from '../sections/@dashboard/blog/Reportes.pdf';
import { obtenerActividades, obtenerHijos, actividadDatos, handleUpdateActivityStatus, eliminarDato } from '../api/actividadApi';
import { obtenerClientes } from '../api/clienteApi';
import { actividadPago, pagarDatos } from '../api/pagoApi';
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
  const [orderBy, setOrderBy] = useState('nombre');
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [showVoucher, setShowVoucher] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const {register, handleSubmit, formState: {errors}, control, reset} = useForm();

  const pagarEvento = handleSubmit(async (field) => {
    console.log(field);
    try {
      // Eliminar campos no deseados
      delete field.nombreActividad;
      delete field.descripcionActividad;
      delete field.estadoActividad;
  
      const idPago = uuidv4();
      const idActividad = field.idActividad; // Usar el idActividad existente en field
      field.idPago = idPago;
      console.log(field);
      await pagarDatos(field);
      await actividadPago(idActividad, idPago); // Enviar solo el idActividad
      toast.success("Pago efectuado");
      reset({
        tipoPago: 'efectivo',
        noVoucher: '',
        nombre: '',
        apellido: '',
        fechaPago: new Date(),
        actividad: null,
        monto: '',
        descripcion: '',
        nit: '',
      });
    } catch (error) {
      console.error("Error al pagar", error);
      toast.error("Error al Pagar");
    }
  });  

  // Obtener el objeto de usuario desde localStorage
  const localStorageUser = JSON.parse(localStorage.getItem('user'));
  // Extraer el valor de 'tipoRol' del objeto de usuario
  const role = localStorageUser ? localStorageUser.tipoRol : null;

  const [cliente, setCliente] = useState('');
  const [dataReporte, setData] = useState([]);
  const [hijo, setHijo] = useState('');
  const [selectedCliente, setSelectedCliente] = useState('');
  Modal.setAppElement('#root'); // Agrega esta línea
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isNewEventModalOpen, setNewEventModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newEvent, setNewEvent] = useState({
    fechaEntrega: '',
    fechaInicio: '',
    fechaFinal: ''
  });

  const getRandomColor = () => {
    const colors = ['blue', 'green', 'red', 'orange', 'purple', 'pink', 'teal'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };  
  const fetchEvents = async () => {
    try {
      const response = await obtenerActividades();
      const dataReporte = response.data;
      const filteredEvents = response.data.map(event => ({
        id: event.idActividad,
        title: event.nombreActividad,
        description: event.descripcionActividad,
        entrega: event.fechaEntrega,
        estado: event.estadoActividad,
        start: moment.utc(event.fechaInicio).tz('America/Guatemala').toDate(), // Convertir y ajustar a la zona horaria de Guatemala
        end: moment.utc(event.fechaFinal).tz('America/Guatemala').toDate(),   // Convertir y ajustar a la zona horaria de Guatemala
        cliente: event.idCliente,
        backgroundColor: getRandomColor(),
      }));
      setEvents(filteredEvents); // Agregar esta línea para actualizar los eventos en el estado
      setactividadData(response.data);
      setData(dataReporte);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };  
  const hijosDatos = async () => {
    try {
      const response = await obtenerHijos();
      const dataHijo = response.data;
      setHijo(dataHijo);
    } catch (error) {
      console.error("Error al pasar los datos", error);
      toast.error("Error al obtener los datos");
    }
  }
  useEffect(() => {
    async function getActividades() {
      try {
        const response = await obtenerClientes();
        const clienteData = response.data;

        const actividadesFormatted = clienteData.map(actividad => ({
          value: actividad.idCliente,
          label: actividad.nombreClient
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
    hijosDatos()
    getActividades();
    fetchEvents();
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const formattedEvent = {
        ...values,
        fechaEntrega: moment(newEvent.fechaEntrega).add(1, 'day').startOf('day').format('YYYY-MM-DD'),
        fechaInicio: moment(newEvent.fechaInicio).add(1, 'day').startOf('day').format('YYYY-MM-DD'),
        fechaFinal: moment(newEvent.fechaFinal).add(1, 'day').startOf('day').format('YYYY-MM-DD'),
        idCliente: selectedCliente.value // Usar el valor seleccionado del cliente
      };
      await actividadDatos(formattedEvent);
      toast.success('Actividad Creada');
      fetchEvents();
      reset({
        nombreActividad: '',
        descripcionActividad: '',
        idCliente: '',
      });
      setNewEvent({
        fechaEntrega: '',
        fechaInicio: '',
        fechaFinal: '',
      });
      closeNewEventModal();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Error al crear la actividad');
    }
  });   

  const deleteEvent = async (id) => {
    try {
      console.log(id);
      await eliminarDato(id);
      fetchEvents();
      setSelectedEvent(null);
      toast.success('Actividad Eliminada');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Error al eliminar la Actividad');
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

  const updateEvent = () => {
    const eventData = {
      nombreActividad: selectedEvent.title,
      descripcionActividad: selectedEvent.description,
      fechaEntrega: moment(selectedEvent.entrega).format('YYYY-MM-DD'),
      fechaInicio: moment(selectedEvent.start).startOf('day').toISOString(),
      fechaFinal: moment(selectedEvent.end).startOf('day').toISOString(),
      idCliente: selectedCliente.value,
    };
    console.log("Datos:",eventData);
    axios.put(`http://localhost:5000/bagapp-react/us-central1/app/actividad/${selectedEvent.id}`, eventData)
      .then((res) => {
        console.log(res);
        setSelectedEvent(null);
        fetchEvents();
        toast.success('Se actualizo la actividad correctamente');
      })
      .catch((err) => {
        toast.error('Error al intentar actualizar mi actividad');
        console.error(err);
      });
  };  

  const handleActividadChange = (selectedOption) => {
    setSelectedCliente(selectedOption);
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
  const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
  };
  const handleSelectAll = (event, idActividad) => {
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

        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={selectEvent}
            eventPropGetter={event => ({
              style: {
                backgroundColor: event.backgroundColor,
              },
            })}
         />
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
                        <TableCell align="left">{row.cliente.nombreClient}</TableCell>
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
          <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginLeft: '15px', marginBottom: '20px' }}>
            <ReportePDF dataReporte={dataReporte} hijo={hijo} />
          </div>
        </Card>
        ) : null} 

        <Modal
          isOpen={isNewEventModalOpen}
          onRequestClose={closeNewEventModal}
          style={{
            overlay: {
              zIndex: 1000,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            content: {
              top: '80%',
              left: '60%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '8px',
              padding: '20px',
              maxWidth: '800px',
              margin: 'auto',
              width: '80%', // Ajusta el ancho del modal
              height: '65%', // Ajusta la altura del modal
            },
          }}          
        >
          {/* Contenido del modal */}
          <div>
            <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column" }}>
              <TextField
                type="text"
                label="Nombre de la Actividad"
                {...register("nombreActividad")}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <TextField
                type="text"
                label="Descripción de la Actividad"
                {...register("descripcionActividad")}
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
                value="Pendiente"
                {...register("estadoActividad")}
                fullWidth
                sx={{ marginBottom: 2 }}
                readOnly
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
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0px' }}>
                <h6 style={{ margin: '0', marginRight: '8px' }}>Fecha Final</h6>
                <TextField
                  type="date"
                  value={newEvent.fechaFinal}
                  onChange={(e) => setNewEvent({ ...newEvent, fechaFinal: e.target.value })}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
              </div>
              <h6 style={{ margin: '0', marginRight: '5px' }}>Cliente</h6>
              <Controller
                name="idCliente" // Nombre del campo
                control={control}
                defaultValue={null} // Valor inicial (puede ser null u otra opción predeterminada)
                render={({ field }) => (
                  <Select
                    {...field}
                    sx={{ marginRight: 2 }}
                    value={selectedCliente}
                    onChange={(selectedOption) => {
                      setSelectedCliente(selectedOption); // Actualizar el estado con la opción seleccionada
                      field.onChange(selectedOption); // Actualizar el valor en React Hook Form
                    }}
                    options={cliente}
                    isClearable
                    placeholder="Seleccione un Cliente"
                  />
                )}
              />
              <div style={{display: "flex", marginTop: "10px"}}>
                <Button type="submit" variant="contained" color="primary">
                  Crear Evento
                </Button>
                <Button onClick={closeNewEventModal} variant="contained" style={{marginLeft: "20px"}}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
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
            {role === 'Administrador' ? (
              <div>
                <Button onClick={() => deleteEvent(selectedEvent.id)}>Eliminar Evento</Button>
                <Button onClick={() => setIsEditing(!isEditing)}>Actualizar Evento</Button>
                {isEditing && (
                  <Button onClick={() => updateEvent(selectEvent.id)}>Guardar</Button>
                )}
              </div>
            ) : null}
            {role === 'Cliente' ? (
              <div>
                <Button variant='contained' onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancelar Compra' : 'Comprar Boleto'}
                </Button><br/>
              </div>
            ) : null}
            {showForm && (
              <form 
                onSubmit={pagarEvento}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <Typography variant='h4'>Tipo de pago</Typography>
                <Controller
                  name="tipoPago"
                  control={control}
                  defaultValue="efectivo" // Establece el valor inicial deseado
                  render={({ field }) => (
                    <RadioGroup
                      aria-label="payment-method"
                      name="paymentMethod"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value === 'voucher') {
                          // Mostrar el TextField de Voucher si se selecciona 'voucher'
                          setShowVoucher(true);
                        } else {
                          // Ocultar el TextField de Voucher si se selecciona 'efectivo'
                          setShowVoucher(false);
                        }
                      }}
                    >
                      <div style={{display: "flex", marginTop: "15px", marginLeft: "20px"}}>
                        <FormControlLabel value="efectivo" control={<Radio />} label="Efectivo" />
                        <FormControlLabel value="voucher" control={<Radio />} label="Voucher" />
                      </div>
                    </RadioGroup>
                  )}
                />
                {showVoucher && (
                  <Controller
                    name="noVoucher"
                    control={control}
                    defaultValue=""
                    render={({field}) => (
                      <TextField 
                        type='text'
                        label="Numero de Voucher"
                        {...field}
                        style={{marginRight: "20px", marginLeft: "20px", marginTop: "10px"}}
                      />
                    )}
                  />
                )}
                <div style={{display: "flex"}}>
                  <TextField type="text" {...register("nombre")} label="Nombre" style={{ marginBottom: "10px", marginLeft: "10px", marginTop: "10px"}} fullWidth />
                  {errors.nombre && <p style={{color: "red"}}>Username is required</p>}
                  <TextField type="text" {...register("apellido")} label="Apellido" style={{ marginBottom: "20px", marginLeft: "20px", marginTop: "10px" }} fullWidth />
                  {errors.apellido && <p style={{color: "red"}}>Username is required</p>}
                </div>
                <div style={{ display: "flex" }}>
                  {showVoucher && (
                    <>
                      <TextField
                        type="date"
                        {...register("fechaPago")}
                        style={{ marginBottom: "10px", marginLeft: "10px", marginRight: "20px" }}
                      />
                      {errors.fechaPago && <p style={{ color: "red" }}>Date is required</p>}
                    </>
                  )}
                  <TextField
                    type="text"
                    {...register("monto")}
                    label="Monto"
                    fullWidth
                    sx={{ marginBottom: 2, marginLeft: 2 }}
                  />
                  {errors.monto && <p style={{ color: "red" }}>Monto is required</p>}
                  <TextField
                    type="text"
                    {...register("idActividad")}
                    sx={{ marginBottom: 2, marginLeft: 2 }}
                    fullWidth
                    value={selectedEvent.id}
                  />
                </div>
                <TextField type="text" {...register("descripcion", { required: true })} label="Descripcion" fullWidth sx={{ marginBottom: 2 }} multiline />
                {errors.descripcion && <p style={{color: "red"}}>Username is required</p>}
                {showVoucher && (
                  <Controller
                    name="nit"
                    control={control}
                    defaultValue=""
                    render={({field}) => (
                      <TextField 
                        type='text'
                        label="NIT"
                        {...field}
                        style={{marginBottom: 20}}
                      />
                    )}
                  />
                )}
                <Button type="submit" variant='contained' color='primary'>Pagar</Button>
              </form>
            )}
          </Modal>
        )}

      </Container>
    </>
  );
}
