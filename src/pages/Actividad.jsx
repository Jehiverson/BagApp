// Importamos hooks de react incluyendo useState y useEffect
import React, { useState, useEffect } from 'react';

// Importamos la biblioteca de react-helmet-async mas informacion visita la documentacion en este enlace: https://www.npmjs.com/package/react-helmet-async
import { Helmet } from 'react-helmet-async';

// Importamos los diseño que usaremos de la biblioteca de @mui/material
import { Button, Container, Stack, Typography, TableContainer, TablePagination, Table, TableBody, TableRow, TableCell, Card, Paper, Checkbox, Input, InputAdornment, Button as MUIButton } from '@mui/material';

// Importamos la biblioteca de react-big-calender mas informacion visita la documentacion en este enlace: https://jquense.github.io/react-big-calendar/examples/?path=/story/about-big-calendar--page
import { Calendar, momentLocalizer } from 'react-big-calendar'; 

// Importamos componente de la biblioteca de @mui/material
import Grid from '@mui/material/Grid';

// Importación de 'sentenceCase' desde la biblioteca 'change-case' para formatear cadenas de texto.
import { sentenceCase } from 'change-case';

// Importación de 'moment' para el manejo de fechas y horas.
import moment from 'moment';

// Archivo de localización de 'moment' para formato en español.
import 'moment/locale/es';

// Importación de 'moment-timezone' para trabajar con zonas horarias.
import 'moment-timezone';

// Importación de la función 'styled' de Material-UI para crear estilos en componentes.
import { styled } from '@mui/material/styles';

// Importación de iconos de Material-UI para su uso en componentes.
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Importación de la biblioteca 'react-toastify' para mostrar notificaciones emergentes.
import { toast } from 'react-toastify';

// Archivo CSS relacionado con 'react-toastify' para estilizar las notificaciones emergentes.
import 'react-toastify/dist/ReactToastify.css';

// Archivo CSS relacionado con 'react-big-calendar' para estilizar un calendario.
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Importación del componente 'Modal' de 'react-modal' para crear ventanas modales.
import Modal from 'react-modal';

// Importación del componente 'Label' desde un archivo en mi proyecto.
import Label from '../components/label';

// Importación del componente 'UserListToolbar' desde un archivo en mi proyecto.
import { UserListToolbar } from '../sections/@dashboard/blog';

// Importación del componente 'Scrollbar' desde un archivo en mi proyecto.
import Scrollbar from '../components/scrollbar';

// Importación del componente 'UserListHead' desde un archivo en mi proyecto.
import { UserListHead } from '../sections/@dashboard/user';

// Importación del componente 'Iconify' desde un archivo en mi proyecto.
import Iconify from '../components/iconify';

// Importamos las APIs de mis actividades
import { obtenerActividades, handleUpdateActivityStatus, eliminarDato } from '../api/actividadApi';

// Importamos componente del formulario para Cambiar Eventos
import {FormCambioEvento} from '../components/formulario/formCambioEvento';

// Importamos componente del formulario para hacer pagos
import { FormPago } from '../components/formulario/formPago';

// Importamos componente del formulario para Actualizar un Evento
import { FormActualizarEvento } from '../components/formulario/formActualizarEvento';

// Importamos componente del formulario para Ingresar Actividades
import { FormIngresarActividad } from '../components/formulario/formIngresarActividad';

moment.locale('es'); // Establece el idioma si lo deseas
moment.tz.setDefault('America/Guatemala'); // Establece la zona horaria local

// Define el array de cabeceras de tabla
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

// Función para comparar elementos en orden descendente
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

// Función para obtener un comparador en función del orden y la columna
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

// Función para aplicar filtro y orden a una lista
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

// Creamos estilo personalizado para mi Input
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

// Creamos estilo personalizado de para mi Boton
const StyledButton = styled(MUIButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export default function Actividad() {
  // Estados para almacenar datos y control de la página
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

  // Creamos una const para cambiar los nombres de mi botones de mi Calendario
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

  // Funcion para Abrir Modal
  const openNewEventModal = () => {
    setIsModalOpen(true);
  };

  // Funcion para Cerrar Modal
  const closeNewEventModal = () => {
    setIsModalOpen(false);
  };

  // Funcion para generar colores random para mis Actividades
  const getRandomColor = () => {
    const colors = ['blue', 'green', 'red', 'orange', 'purple', 'pink', 'teal'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }; 
  
  // Funcion para obtener los datos de mi API
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
  
  // Funcion para renderizar mi API y cambia de estado cuando se llama pasa a true y ya no vuelve a llamar la API para evitar errores
  useEffect(() => {
    if (!apiCalled) {
      fetchEvents();
      setApiCalled(true);
    }
  }, [apiCalled]);

  // Funcion para eliminar actividades
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

  // Funcion para navegar en mi Calendario
  const handleCalendarNavigate = (newDate) => {
    setSelectedDate(newDate);
  };
  
  // Funcion para buscar por nombre
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      // Si el término de búsqueda está vacío, no hacemos nada
      return;
    }
    
  // Convierte el valor de 'searchTerm' a minúsculas
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
  
  // Función asincrónica para actualizar el estado de la actividad
  const updateActivityStatus = async () => {
    if (selected.length === 1) {
      const selectedId = selected[0];

      try {
        // Llama a la función 'handleUpdateActivityStatus' para actualizar el estado de la actividad
        await handleUpdateActivityStatus(selectedId, { estadoActividad: 'Completa' }, actividadData, setactividadData);

        // Limpia la selección y muestra una notificación de éxito
        setSelected([]);
        toast.success("Actividad Entregada");
      } catch (error) {
        // En caso de error, muestra un mensaje de error en la consola y una notificación de error
        console.error('Error updating activity status:', error);
        toast.error("Error al actualizar Actividad");
      }
    }
  };

  // Función para seleccionar un evento
  const selectEvent = (event) => {
    setSelectedEvent(event);
  };

  // Función para manejar la ordenación de los datos
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Función para seleccionar todos los elementos o deseleccionarlos
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(actividadData.map((actividadData) => actividadData.idActividad));
    } else {
      setSelected([]);
    }
  };

  // Función para manejar el clic en un elemento
  const handleClick = (event, name) => {
    console.log('Clicked activity ID:', name); // Agrega este console.log

    // Lógica para gestionar la selección de elementos
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

  // Función para cambiar la página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Función para cambiar el número de filas por página
  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Función para manejar el filtro por nombre
  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // Cálculo de filas vacías para la paginación
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - actividadData.length) : 0;

  // Filtrar los usuarios según la ordenación y el filtro aplicados
  const filteredUsers = applySortFilter(actividadData, getComparator(order, orderBy), filterName);

  // Comprobar si no se encontraron resultados después de aplicar el filtro
  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Actividades</title> {/* Cambia el título de la página */}
      </Helmet>

      <Container>
      {/* Encabezado de la página */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Actividades
        </Typography>
        {/* Botón "Nueva Actividad" condicional basado en el rol del usuario */}
        {role === 'Administrador' ? (
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={openNewEventModal}>
            Nueva Actividad
          </Button>    
        ) : null}
      </Stack>
      {/* Modal para crear una nueva actividad */}
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
          {/* Formulario para ingresar una nueva actividad */}
          <FormIngresarActividad closeNewEventModal={closeNewEventModal} fetchEvents={fetchEvents} />
        </div>
      </Modal>
      {/* Barra de búsqueda */}
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
        // Configuración del calendario
        localizer={localizer} // Proporciona la configuración regional y las traducciones
        events={events} // Lista de eventos que se mostrarán en el calendario
        messages={messages} // Mensajes y textos personalizados
        defaultDate={new Date()} // Fecha inicial predeterminada (hoy)
        startAccessor="fechaInicio" // Accesor para obtener la fecha de inicio de cada evento
        endAccessor="fechaFinal" // Accesor para obtener la fecha de finalización de cada evento
        style={{ height: 500 }} // Estilo del calendario (altura)
        onSelectEvent={selectEvent} // Función para manejar la selección de un evento
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.backgroundColor, // Color de fondo personalizado para cada evento
          },
        })}
        date={selectedDate} // Fecha seleccionada en el calendario (asegúrate de que selectedDate sea un estado en tu componente)
        onNavigate={handleCalendarNavigate} // Función para manejar la navegación en el calendario
      />


      {role === 'Administrador' ? ( // Comprueba si el rol del usuario es 'Administrador'
        <Card style={{ marginTop: 20, height: 250, alignItems: 'center', p: 3, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', backgroundColor: 'white' }}>
          {/* Un bloque de tarjeta que aparece si el usuario es 'Administrador' */}
          <div style={{ marginTop: 25 }}>
            {/* Un formulario llamado FormCambioEvento */}
            <FormCambioEvento />
          </div>
        </Card>
      ) : null}  {/* Fin del bloque de tarjeta, si el usuario no es 'Administrador' */}

      {role === 'Administrador' ? ( // Comprueba si el rol del usuario es 'Administrador'
        <Typography variant="h4" gutterBottom style={{ margin: '10px' }}>
          Listado de Actividades con Pago
        </Typography>
      ) : null} {/* Un encabezado de texto si el usuario es 'Administrador' */}

      {role === 'Administrador' ? ( // Comprueba si el rol del usuario es 'Administrador'
        <Card>
          {/* Encabezado y herramientas de filtrado para la lista de usuarios */}
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteSelected={updateActivityStatus}
            selected={selected}
          />
          <Scrollbar>
            {/* Contenedor de la tabla con desplazamiento */}
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                {/* Cabecera de la tabla con opciones de ordenación */}
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
                      // Extracción de propiedades de la fila
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
                        // Renderización de una fila de la tabla
                        <TableRow key={idActividad} hover tabIndex={-1} role="checkbox" selected={selectedUser} >
                          <TableCell padding="checkbox">
                            {/* Casilla de verificación para seleccionar la fila */}
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, idActividad)} />
                          </TableCell>
                          <TableCell align="left">{idActividad}</TableCell>
                          <TableCell align="left">{nombreActividad}</TableCell>
                          <TableCell align="left">{descripcionActividad}</TableCell>
                          <TableCell align="left">{moment.utc(fechaEntrega).tz('America/Guatemala').format('YYYY-MM-DD')}</TableCell>
                          <TableCell align="left">
                            {/* Etiqueta de estado (Pendiente o Completada) */}
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
                  {/* Filas vacías para la paginación */}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={8} />
                    </TableRow>
                  )}
                </TableBody>
                {/* Mensaje de "No encontrado" si no hay resultados después del filtro */}
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
          {/* Paginación de la tabla */}
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
      ) : null} {/* Fin del bloque de tarjeta, si el usuario no es 'Administrador' */}

      {selectedEvent && ( // Comprueba si 'selectedEvent' tiene un valor (es diferente de null o undefined)
        <Modal 
          isOpen // Indica que el modal está abierto
          onRequestClose={() => setSelectedEvent(null)} // Función para cerrar el modal al hacer clic fuera de él
          style={{
            overlay: {
              zIndex: 1000, // Capa de z-index para el fondo del modal
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscurecido del modal
            },
            content: {
              top: '50%', // Posición vertical del modal (centro)
              left: '50%', // Posición horizontal del modal (centro)
              transform: 'translate(-50%, -50%)', // Centrar el modal en la pantalla
              borderRadius: '8px', // Borde redondeado del modal
              padding: '20px', // Espacio interno del modal
              maxWidth: '90%', // Ancho máximo del modal (90% del ancho disponible)
              width: 'auto', // Ancho automático del modal
            },
          }}
        >
          {role === 'Administrador' ? ( // Comprueba si el rol del usuario es 'Administrador'
            <div>
              <div style={{ marginTop: 15 }}>
                <Button
                  variant='contained'
                  color='info'
                  onClick={() => setShowActualizar(!showActualizar)}
                  startIcon={<EditIcon />} // Icono de edición
                  style={{ marginRight: 15 }}
                >
                  Actualizar Evento
                </Button>
                <Button
                  variant='contained'
                  color='error'
                  onClick={() => deleteEvent(selectedEvent.idActividad)} // Función para eliminar el evento
                  startIcon={<DeleteIcon />} // Icono de eliminación
                >
                  Eliminar Evento
                </Button>
              </div>
              <br />
              {showActualizar ? ( // Muestra un formulario de actualización si 'showActualizar' es verdadero
                <div style={{ marginTop: 15 }}>
                  <Typography variant='h6'>Actualizar Datos de la Actividad</Typography>
                  <FormActualizarEvento selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} fetchEvents={fetchEvents} />
                </div>
              ) : null}
            </div>
          ) : null}
          {role === 'Cliente' || role === 'Usuario' || role === 'Administrador' ? ( // Comprueba si el rol es 'Cliente', 'Usuario' o 'Administrador'
            <div>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper elevation={3} style={{ padding: '16px', background: '#f5f5f5' }}>
                    <Typography variant='h6' style={{ color: '#333', marginBottom: '8px' }}>
                      {selectedEvent.title} {/* Muestra el título del evento */}
                    </Typography>
                    <Typography variant='body1' style={{ color: '#555' }}>
                      {selectedEvent.descripcionActividad} {/* Muestra la descripción del evento */}
                    </Typography>
                    <Typography variant='body1' style={{ color: '#555' }}>
                      <span style={{ fontWeight: 'bold' }}>Este: </span>{convertirFechaAC(selectedEvent.fechaEntrega)} {/* Muestra la fecha de entrega */}
                    </Typography>
                    <Typography variant='body1' style={{ color: '#555' }}>
                      <span style={{ fontWeight: 'bold' }}>Precio de Entrada: </span>Q{selectedEvent.precioActividad} {/* Muestra el precio de entrada */}
                    </Typography>
                    <Typography variant='body1' style={{ color: '#555' }}>
                      <span style={{ fontWeight: 'bold' }}>Lugar de Actividad: </span>{selectedEvent.lugarActividad} {/* Muestra el lugar de la actividad */}
                    </Typography>
                  </Paper>
                </Grid>
                {role === 'Administrador' ? (
                  <Grid item xs={12}>
                    <Button
                      variant='contained'
                      color='primary' // Color primario de Material-UI
                      onClick={() => setShowForm(!showForm)} // Función para mostrar/ocultar el formulario de compra
                    >
                      {showForm ? 'Cancelar Compra' : 'Comprar Boleto'} {/* Cambia el texto del botón según 'showForm' */}
                    </Button>
                  </Grid>
                ) : null} 
              </Grid>
            </div>
          ) : null}
          {showForm && ( // Muestra el formulario de compra si 'showForm' es verdadero
            <FormPago idActividad={selectedEvent.idActividad} setSelectedEvent={setSelectedEvent} />
          )}
        </Modal>
      )}

      </Container>
    </>
  );

  // Función para convertir una fecha UTC a la fecha local de América Central
  function convertirFechaAC(fechaUTC) {
    // Crea un objeto Date a partir de la fecha UTC proporcionada
    const fechaLocal = new Date(fechaUTC);

    // Define opciones de formato para la conversión
    const options = { timeZone: 'America/El_Salvador', year: 'numeric', month: 'numeric', day: 'numeric' };

    // Utiliza el método toLocaleString() para obtener la fecha y hora en la zona horaria de América Central
    return fechaLocal.toLocaleString(undefined, options);
  }

}