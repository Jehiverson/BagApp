import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Avatar, Card, Table, Stack, Paper, Button, TableRow, TableBody, TableCell, Container, Typography, TableContainer, TablePagination, IconButton, } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ReactModal from 'react-modal';
import moment from 'moment';
import 'moment/locale/es';
import 'moment-timezone';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { obtenerClientes } from '../api/clienteApi';
import { FormIngresarCliente } from '../components/formulario/formIngresarCliente';
import { FormActualizarCliente } from '../components/formulario/formActualizarCliente';

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

export default function UserPage() {
  ReactModal.setAppElement('#root'); 
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
  useEffect(() => {
    fetchClientes(setClientes);
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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
    fetchClientes(setClientes);
  };
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - clientes.length) : 0;
  const filteredUsers = applySortFilter(clientes, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;
  return (
    <>
      <Helmet>
        <title>Clientes</title>
      </Helmet>

      <Container>
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
        {role === 'Administrador' || role === 'Usuario' ? (
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
                />
                <TableBody>
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
                        <TableCell align="left">{moment.utc(fechaNacimiento).tz('America/Guatemala').format('YYYY-MM-DD')}</TableCell>
                        <TableCell align="left">{dpi}</TableCell>
                        <TableCell align="left">{estadoCivil}</TableCell>
                        <TableCell align="left">{trabajando}</TableCell>
                        <TableCell align="left">{cantidadHijos}</TableCell>
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
