import { Helmet } from 'react-helmet-async'; // Importamos la biblioteca de react-helmet-async mas informacion visita la documentacion en este enlace: https://www.npmjs.com/package/react-helmet-async
import { useState, useEffect } from 'react'; // Importamos hooks y useState y useEffect de react
import { Avatar, Card, Table, Stack, Paper, Button, TableRow, TableBody, TableCell, Container, Typography, TableContainer, TablePagination, IconButton, } from '@mui/material'; // Importamos los diseño que usaremos de la biblioteca de @mui/material
import EditIcon from '@mui/icons-material/Edit'; // Importamos un icono de @mui/material
import ReactModal from 'react-modal'; // Importamos el Modal de la biblioteca de react-modal mas informacion visita la documentacion en este enlace: https://www.npmjs.com/package/react-modal
import moment from 'moment'; // Importamos la biblioteca moment mas informacion visita la documentacion en este enlace: https://momentjs.com/
import 'moment/locale/es'; // Importamos el horario local en español
import 'moment-timezone'; // Importamos el tiempo en mi zona
import Iconify from '../components/iconify'; // Importamos componente de mi aplicacion
import Scrollbar from '../components/scrollbar'; // Importamos el Scrollbar de mi aplicacion
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user'; // Importamos componentes para mi Tabla
import { obtenerClientes } from '../api/clienteApi'; // Importamos la API de cliente
import { FormIngresarCliente } from '../components/formulario/formIngresarCliente'; // Importamos el formulario para registrar clientes
import { FormActualizarCliente } from '../components/formulario/formActualizarCliente'; // Importamos el formulario para actualizar los datos de un cliente

// Función para comparar elementos en orden descendente
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

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
    return array.filter((_user) => _user && _user.nombreClient.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

// Función para obtener la lista de clientes
export const fetchClientes = (setClientes) => {
  obtenerClientes()
    .then(response => {
      setClientes(response.data);
    })
    .catch(error => {
      console.error('Error al obtener los datos de los clientes:', error);
    });
};

export default function Cliente() {
  ReactModal.setAppElement('#root'); 
  // Estados para almacenar datos y control de la página
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('nombreClient');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // Obtener el objeto de usuario desde localStorage
  const localStorageUser = JSON.parse(localStorage.getItem('user'));
  // Extraer el valor de 'tipoRol' del objeto de usuario
  const role = localStorageUser ? localStorageUser.tipoRol : null;

  const [clientes, setClientes] = useState([]);
  const [isNewEventModalOpen, setNewEventModalOpen] = useState(false);
  const [abrirModal, setAbrirModal] = useState(false);
  const [seleccionar, setSeleccionar] = useState(null);
  // Define el array de cabeceras de tabla
  const TABLE_HEAD = [
    { id: 'nameClient', label: 'Nombre', alignRight: false },
    { id: 'apellidoClient', label: 'Apellido', alignRight: false },
    { id: 'fechaNacimiento', label: 'Fecha de Nacimiento', alignRight: false},
    { id: 'DPI', label: 'DPI', alignRight: false },
    { id: 'estadoCivil', label: 'Estado Civil', alignRight: false },
    { id: 'trabajando', label: 'Trabaja', alignRight: false },
    { id: 'cantidadHijos', label: 'Cantidad de Hijos', alignRight: false },
  ];

  // Agrega la columna "Editar" solo si el rol es "Administrador"
  if (role === 'Administrador') {
    TABLE_HEAD.push({ id: 'Editar', label: 'Editar', alignRight: false });
  }

  // Efecto que obtiene los datos de los clientes
  useEffect(() => {
    fetchClientes(setClientes);
  }, []);

  // Función para manejar la solicitud de ordenación de columnas
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Función para cambiar de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Función para cambiar el número de filas por página
  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Función para filtrar por nombre
  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // Funcion para abrir Modal
  const openNewEventModal = () => {
    setNewEventModalOpen(true);
  };

  // Funcion para cerrar Modal
  const closeNewEventModal = () => {
    setNewEventModalOpen(false);
    fetchClientes(setClientes);
  };

  // Funcion para abrir Modal
  const handleOpenModal = (userData) => {
    setSeleccionar(userData);
    setAbrirModal(true);
  };
  // Función para cerrar el modal
  const handleCloseModal = () => {
    setSeleccionar(null);
    setAbrirModal(false);
    fetchClientes(setClientes);
  };

  // Calcula el número de filas vacías en la tabla
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - clientes.length) : 0;

  // Aplica filtro y orden a los datos de pago
  const filteredUsers = applySortFilter(clientes, getComparator(order, orderBy), filterName);

  // Verifica si no se encontraron resultados
  const isNotFound = !filteredUsers.length && !!filterName;

  // Renderiza la interfaz de usuario
  return (
    <>
      <Helmet>
        <title>Clientes</title>  {/* Cambia el título de la página */}
      </Helmet>

      <Container>
        {/* Renderizamos los Botones para crear Clientes si el rol es "Administrador" */}
        {role === 'Administrador' && (
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Clientes
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={openNewEventModal}>
            Nuevo Cliente
          </Button>
        </Stack>
        )}
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
            <FormIngresarCliente closeModal={closeNewEventModal} />
        </ReactModal>

        {/* Renderiza la tabla de pagos si el rol es "Administrador" o "Usuario" */}
        {role === 'Administrador' || role === 'Usuario' ? (
          <Card>
          {/* Barra de herramientas de la lista de usuarios */}
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          {/* Barra de desplazamiento para la tabla */}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                {/* Cabecera de la tabla */}
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={clientes.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {/* Renderiza filas de la tabla */}
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      idCliente,
                      nombreClient,
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
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={nombreClient} />
                            <Typography variant="subtitle2">{nombreClient}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{apellidoClient}</TableCell>
                        {/* Formatea y muestra la fecha en la zona horaria de Guatemala */}
                        <TableCell align="left">{moment.utc(fechaNacimiento).tz('America/Guatemala').format('YYYY-MM-DD')}</TableCell>
                        <TableCell align="left">{dpi}</TableCell>
                        <TableCell align="left">{estadoCivil}</TableCell>
                        <TableCell align="left">{trabajando}</TableCell>
                        <TableCell align="left">{cantidadHijos}</TableCell>
                        {/* Renderiza un botón de edición si el rol es "Administrador" */}
                        {role === 'Administrador' ? (
                        <TableCell>
                          <IconButton onClick={() => handleOpenModal(row)}> {/* Agrega evento onClick */}
                            <EditIcon /> {/* Puedes usar un ícono de edición o similar */}
                          </IconButton>
                        </TableCell>
                        ) : null}
                      </TableRow>
                    );
                  })}
                  {/* Renderiza filas vacías si es necesario */}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={8} />
                    </TableRow>
                  )}
                </TableBody>

                {/* Muestra un mensaje si no se encontraron resultados */}
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
            count={clientes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        ) : null}
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
          <FormActualizarCliente
            cliente={seleccionar}
            closeModal={handleCloseModal}
           />
        </ReactModal>
      </Container>
    </>
  );
}
