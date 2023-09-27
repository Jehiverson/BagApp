import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Card, TableContainer, TablePagination, Table, TableBody, TableRow, TableCell, Paper, IconButton} from '@mui/material';
import moment from 'moment';
import Modal from 'react-modal';
import EditIcon from '@mui/icons-material/Edit';
import 'moment/locale/es';
import 'moment-timezone';
import Scrollbar from '../components/scrollbar';
import PaymentsPDFGenerator from '../sections/@dashboard/pagopdf/PaymentsPDFGenerator';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { pagoUnion } from '../api/pagoApi';
import { FormActualizarPago } from '../components/formulario/formPagoActualizar';

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
    return array.filter((_user) => _user && _user.nombre.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
export default function ProductsPage() {
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

  const getPagos = async () => {
    try {
      const responsePagos = await pagoUnion();
      const pagoData = responsePagos.data;
      setPagoData(pagoData);
    } catch (error) {
      console.error("Error al obtener los datos de los pagos:", error);
    }
  }

  useEffect(() => {
    if (pagoData.length === 0) {
      getPagos();
    }
  }, [pagoData]);

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
  const handleOpenModal = (userData) => {
    setSelectedRowData(userData);
    setAbrirModal(true);
  };
  
  const handleCloseModal = () => {
    setSeleccionar(null);
    setAbrirModal(false);
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - pagoData.length) : 0;
  const filteredUsers = applySortFilter(pagoData, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;
  return (
    <>
      <Helmet>
        <title>Pagos</title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Pagos
        </Typography>

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
          <FormActualizarPago
            cliente={selectedRowData}
            closeModal={handleCloseModal}
            getPagos={getPagos}
          />
        </Modal>

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
                  rowCount={pagoData.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  showCheckbox={false}
                />
                <TableBody>
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
                        <TableCell align="left">{moment.utc(fechaPago).tz('America/Guatemala').format('YYYY-MM-DD')}</TableCell>
                        <TableCell align="left">{monto}</TableCell>
                        <TableCell align="left">{actividad.nombreActividad}</TableCell>
                        <TableCell align="left">{noVoucher}</TableCell>
                        <TableCell align="left">{tipoPago}</TableCell>
                        <TableCell align="left">{nit}</TableCell>
                        <TableCell align="left">{descripcion}</TableCell>
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
            count={pagoData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginLeft: '15px', marginBottom: '20px' }}>
            <PaymentsPDFGenerator pagoData={pagoData} />
          </div>
        </Card>
        ) : null}

      </Container>
    </>
  );
}
