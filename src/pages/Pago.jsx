import React, { useState, useEffect } from 'react'; // Importa React, useState y useEffect
import { Helmet } from 'react-helmet-async'; // Importa Helmet para el manejo del título de la página
import { Container, Typography, Card, TableContainer, TablePagination, Table, TableBody, TableRow, TableCell, Paper, IconButton } from '@mui/material'; // Importa componentes de Material-UI
import Modal from 'react-modal';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment'; // Importa la biblioteca moment.js para el manejo de fechas y tiempos
import 'moment/locale/es'; // Configura el idioma de moment.js a español
import 'moment-timezone'; // Importa moment-timezone para manejar las zonas horarias
import Scrollbar from '../components/scrollbar'; // Importa un componente personalizado de barra de desplazamiento
import PaymentsPDFGenerator from '../sections/@dashboard/pagopdf/PaymentsPDFGenerator'; // Importa un componente para generar archivos PDF
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user'; // Importa componentes relacionados con la lista de usuarios
import { pagoUnion } from '../api/pagoApi'; // Importa una función para obtener datos de pagos desde una API
import { FormActualizarPago } from '../components/formulario/formPagoActualizar'; // Importa un formulario para actualizar pagos

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
}

// Función para aplicar filtro y orden a una lista
function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter((_user) => _user && _user.nombre.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

// Definición del componente Pago
export default function Pago() {
  // Estados para almacenar datos y control de la página
  const [pagoData, setPagoData] = useState([]);
  const [orderBy, setOrderBy] = useState('nombre');
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [abrirModal, setAbrirModal] = useState(false);
  const [seleccionar, setSeleccionar] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);

  // Obtener el objeto de usuario desde localStorage
  const localStorageUser = JSON.parse(localStorage.getItem('user'));
  // Extraer el valor de 'tipoRol' del objeto de usuario
  const role = localStorageUser ? localStorageUser.tipoRol : null;

  // Definición de las columnas de la tabla
  const TABLE_HEAD = [
    { id: 'idCliente', label: 'ID Cliente', alignRight: false },
    { id: 'nombre', label: 'Nombre', alignRight: false },
    { id: 'apellido', label: 'Apellido', alignRight: false },
    { id: 'fechaPago', label: 'Fecha de Pago', alignRight: false },
    { id: 'monto', label: 'Monto', alignRight: false },
    { id: 'idActividad', label: 'ID Actividad', alignRight: false },
    { id: 'noVoucher', label: 'No. Voucher', alignRight: false },
    { id: 'tipoPago', label: 'Tipo de Pago', alignRight: false },
    { id: 'nit', label: 'NIT', alignRight: false },
    { id: 'descripcion', label: 'Descripción', alignRight: false },
  ];

  // Agrega la columna "Editar" solo si el rol es "Administrador"
  if (role === 'Administrador') {
    TABLE_HEAD.push({ id: 'Editar', label: 'Editar', alignRight: false });
  }

  // Función para obtener datos de pagos desde la API
  const getPagos = async () => {
    try {
      const responsePagos = await pagoUnion();
      const pagoData = responsePagos.data;
      setPagoData(pagoData);
    } catch (error) {
      console.error("Error al obtener los datos de los pagos:", error);
    }
  }

  // Efecto que obtiene los datos de los pagos cuando el componente se monta o cuando cambia el estado de pagoData
  useEffect(() => {
    if (pagoData.length === 0) {
      getPagos();
    }
  }, [pagoData]);

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

  // Función para abrir el modal de edición
  const handleOpenModal = (userData) => {
    setSelectedRowData(userData);
    setAbrirModal(true);
  };
  
  // Función para cerrar el modal de edición
  const handleCloseModal = () => {
    setSeleccionar(null);
    setAbrirModal(false);
  };

  // Calcula el número de filas vacías en la tabla
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - pagoData.length) : 0;

  // Aplica filtro y orden a los datos de pago
  const filteredUsers = applySortFilter(pagoData, getComparator(order, orderBy), filterName);

  // Verifica si no se encontraron resultados
  const isNotFound = !filteredUsers.length && !!filterName;

  // Renderiza la interfaz de usuario
  return (
    <>
      <Helmet>
        <title>Pagos</title> {/* Cambia el título de la página */}
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Pagos
        </Typography>

        {/* Modal para editar pagos */}
        <Modal
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
          {/* Formulario para actualizar pagos */}
          <FormActualizarPago
            cliente={selectedRowData}
            closeModal={handleCloseModal}
            getPagos={getPagos}
          />
        </Modal>

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
                    rowCount={pagoData.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    showCheckbox={false}
                  />
                  <TableBody>
                    {/* Renderiza filas de la tabla */}
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const {
                        idPago,
                        idCliente,
                        nombre,
                        apellido,
                        fechaPago,
                        monto,
                        actividad,
                        noVoucher,
                        tipoPago,
                        nit,
                        descripcion,
                      } = row;

                      return (
                        <TableRow key={idPago} hover tabIndex={-1}>
                          <TableCell align="left">{idCliente}</TableCell>
                          <TableCell align="left">{nombre}</TableCell>
                          <TableCell align="left">{apellido}</TableCell>
                          {/* Formatea y muestra la fecha en la zona horaria de Guatemala */}
                          <TableCell align="left">{moment.utc(fechaPago).tz('America/Guatemala').format('YYYY-MM-DD')}</TableCell>
                          <TableCell align="left">{monto}</TableCell>
                          <TableCell align="left">{actividad.nombreActividad}</TableCell>
                          <TableCell align="left">{noVoucher}</TableCell>
                          <TableCell align="left">{tipoPago}</TableCell>
                          <TableCell align="left">{nit}</TableCell>
                          <TableCell align="left">{descripcion}</TableCell>
                          {/* Renderiza un botón de edición si el rol es "Administrador" */}
                          {role === 'Administrador' ? (
                            <TableCell>
                              <IconButton onClick={() => handleOpenModal(row)}> {/* Pasa los datos de la fila */}
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
              count={pagoData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {/* Botón para generar un PDF de los pagos */}
            <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginLeft: '15px', marginBottom: '20px' }}>
              <PaymentsPDFGenerator pagoData={pagoData} />
            </div>
          </Card>
        ) : null}
      </Container>
    </>
  );
}
