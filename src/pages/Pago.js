import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Button, TextField, Stack, Card, TableContainer, TablePagination, Table, TableBody, TableRow, TableCell, Paper, } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment'; // Cambia la importación de moment
import 'moment/locale/es'; // Importa el idioma si lo deseas
import 'moment-timezone';
import {v4 as uuidv4} from 'uuid';
import Scrollbar from '../components/scrollbar';
import PaymentsPDFGenerator from '../sections/@dashboard/products/PaymentsPDFGenerator';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// Estilos personalizados para el DatePicker
const datePickerStyles = {
  border: '1px solid #ced4da',
  padding: '0.375rem 0.75rem',
  fontSize: '1rem',
  lineHeight: '1.5',
  borderRadius: '0.25rem',
  outline: 'none',
  transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  width: '100%',
  boxSizing: 'border-box',

  '&:focus': {
    borderColor: '#80bdff',
    boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
  },
};
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

  const [tipoPago, settipoPago] = useState('efectivo');
  const [noVoucher, setVoucherNumber] = useState('');
  const [nombre, setName] = useState('');
  const [monto, setMonto] = useState('');
  const [actividades, setActividades] = useState('');
  const [selectedActividad, setSelectedActividad] = useState('');
  const [apellido, setLastName] = useState('');
  const [descripcion, setDescription] = useState('');
  const [isVoucher, setIsVoucher] = useState(false);
  const [nit, setNIT] = useState('');
  const [state, setState] = useState({
    fecha: new Date()
  });
  const handleFechaChange = (date) => {
    setState({ ...state, fecha: date });
  };
  const handlePaymentMethodChange = (event) => {
    settipoPago(event.target.value);
    setIsVoucher(event.target.value === 'voucher');
  };
  const handleVoucherNumberChange = (event) => {
    setVoucherNumber(event.target.value);
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleMontoChange = (event) => {
    setMonto(event.target.value);
  };
  const handleActividadChange = (selectedOption) => {
    setSelectedActividad(selectedOption);
  };  
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleNITChange = (event) => {
    setNIT(event.target.value);
  };
  useEffect(() => {
    async function getActividades() {
      try {
        const response = await axios.get('http://localhost:5000/bagapp-5a770/us-central1/app/api/actividades');
        const actividadData = response.data;

        const actividadesFormatted = actividadData.map(actividad => ({
          value: actividad.idActividad,
          label: actividad.nombreActividad
        }));

        actividadesFormatted.unshift({
          value: 0,
          label: 'Seleccione una Actividad'
        });

        setActividades(actividadesFormatted);
      } catch (error) {
        console.error('Error al obtener las actividades:', error);
      }
    }
    async function getPagos() {
      try {
        const response = await axios.get('http://localhost:5000/bagapp-5a770/us-central1/app/pago');
        const pagoData = response.data;
        setPagoData(pagoData);
      } catch (error) {
        console.error('Error al obtener los datos de los pagos:', error);
      }
    } 
    getPagos();
    getActividades();
  }, []);
  // Ingresar el pago a la base de datos
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const idPago = uuidv4();
  
    const formData = {
      idPago,
      tipoPago,
      noVoucher,
      nombre,
      apellido,
      fechaPago: state.fecha,
      idActividad: selectedActividad ? selectedActividad.value : 0,
      monto,
      descripcion,
      nit,
    };
  
    try {
      const response = await axios.post('http://localhost:5000/bagapp-5a770/us-central1/app/pago', formData);
      console.log('Respuesta del servidor:', response.data);
      
      // Obtén el idActividad de donde sea necesario
      const idActividad = selectedActividad.value;
  
      // Aquí se realizará la actualización de la tabla de actividad y el pago en una sola solicitud
      await axios.put(`http://localhost:5000/bagapp-5a770/us-central1/app/pago/${idActividad}`, {
        idPago: idPago,
      });
  
      // Aquí podrías realizar acciones adicionales dependiendo de la respuesta del servidor
      toast.success('Pago Realizado Con Éxito');
      settipoPago('');
      setName('');
      setLastName('');
      setState({ fecha: new Date() });
      setMonto('');
      setDescription('');
      setVoucherNumber('');
      setNIT('');
      setSelectedActividad(null);
    } catch (error) {
      console.error('Error al enviar datos:', error);
      toast.error('Error al cargar el pago');
    }
  };

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

        <Card sx={{ p: 3, boxShadow: 3, backgroundColor: 'white' }}>
          <form onSubmit={handleSubmit}>
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl component="fieldset">
                <Typography variant='h5'>Tipo de pago</Typography>
                <RadioGroup
                  aria-label="payment-method"
                  name="paymentMethod"
                  value={tipoPago}
                  onChange={handlePaymentMethodChange}
                >
                  <FormControlLabel value="efectivo" control={<Radio />} label="Efectivo" />
                  <FormControlLabel value="voucher" control={<Radio />} label="Voucher" />
                </RadioGroup>
              </FormControl>

              {isVoucher && (
                <FormControl>
                  <TextField
                    type="text"
                    label="Número de Voucher"
                    value={noVoucher}
                    onChange={handleVoucherNumberChange}
                  />
                </FormControl>
              )}
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField label="Nombre" value={nombre} onChange={handleNameChange} fullWidth />
              <TextField label="Apellido" value={apellido} onChange={handleLastNameChange} fullWidth />
            </Stack>
            <Stack direction="row" spacing={2} alignItems="flex-end">
              <DatePicker selected={state.fecha} onChange={handleFechaChange} customInput={<TextField sx={{ ...datePickerStyles, mt: 2 }} />} />
              <div style={{ width: '100%', minWidth: 200 }}>
                <Select
                  value={selectedActividad}
                  onChange={handleActividadChange}
                  options={actividades}
                  fullWidth
                />
              </div>
            </Stack>

            <TextField label="Monto" value={monto} onChange={handleMontoChange} fullWidth sx={{ mt:2 }} />

            <TextField
              label="Descripción"
              value={descripcion}
              onChange={handleDescriptionChange}
              fullWidth
              multiline
              rows={4}
              sx={{ mt: 2 }}
            />

            {isVoucher && (
              <TextField
                label="NIT"
                value={nit}
                onChange={handleNITChange}
                fullWidth
                sx={{ mt: 2 }}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  maxLength: 9,
                }}
              />
            )}

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>
              Pagar
            </Button>
          </form>
        </Card>
        <br />
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
                      idActividad,
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
                        <TableCell align="left">{idActividad}</TableCell>
                        <TableCell align="left">{noVoucher}</TableCell>
                        <TableCell align="left">{tipoPago}</TableCell>
                        <TableCell align="left">{nit}</TableCell>
                        <TableCell align="left">{descripcion}</TableCell>
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

      </Container>
    </>
  );
}
