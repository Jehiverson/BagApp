import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, RadioGroup, FormControlLabel, Radio, Button, TextField, Card, TableContainer, TablePagination, Table, TableBody, TableRow, TableCell, Paper, } from '@mui/material';
import Select from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment'; // Cambia la importación de moment
import 'moment/locale/es'; // Importa el idioma si lo deseas
import 'moment-timezone';
import { useForm, Controller } from "react-hook-form";
import {v4 as uuidv4} from 'uuid';
import Scrollbar from '../components/scrollbar';
import PaymentsPDFGenerator from '../sections/@dashboard/pagopdf/PaymentsPDFGenerator';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { obtenerActividades } from '../api/actividadApi';
import { actividadPago, obtenerPagos, pagarDatos } from '../api/pagoApi';

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

  // Obtener el objeto de usuario desde localStorage
  const localStorageUser = JSON.parse(localStorage.getItem('user'));
  // Extraer el valor de 'tipoRol' del objeto de usuario
  const role = localStorageUser ? localStorageUser.tipoRol : null;

  const [showVoucher, setShowVoucher] = useState(false);
  const { register, handleSubmit, formState: {errors}, control, reset} = useForm();
  
  const onSubmit = handleSubmit(async (values) => {
    try {
      const idPago = uuidv4();
      console.log('idPago:', idPago);
      const idActividad = values.actividad.value;
      values.idActividad = idActividad;
      delete values.actividad;
      values.idPago = idPago;
      await pagarDatos(values);
      await actividadPago(idActividad, idPago);
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
      console.error("Error al pagar", error)
      toast.error("Error al Pagar");
    }
  })

  const [actividades, setActividades] = useState('');
  const [selectedActividad, setSelectedActividad] = useState(null);
  useEffect(() => {
    async function getActividades() {
      try {
        const responseActividades = await obtenerActividades();
        const actividadData = responseActividades.data;

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
        const responsePagos = await obtenerPagos();
        const pagoData = responsePagos.data;
        setPagoData(pagoData);
      } catch (error) {
        console.error('Error al obtener los datos de los pagos:', error);
      }
    } 
    getPagos();
    getActividades();
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
  
        {role === 'Cliente' ? (
          <Card sx={{ p: 3, boxShadow: 3, backgroundColor: 'white', marginBottom: '20px' }}>
          <form 
            onSubmit={onSubmit}
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
              <TextField type="text" {...register("nombre", { required: true })} label="Nombre" style={{ marginBottom: "10px", marginLeft: "10px", marginTop: "10px"}} fullWidth />
              {errors.nombre && <p style={{color: "red"}}>Username is required</p>}
              <TextField type="text" {...register("apellido", { required: true })} label="Apellido" style={{ marginBottom: "20px", marginLeft: "20px", marginTop: "10px" }} fullWidth />
              {errors.apellido && <p style={{color: "red"}}>Username is required</p>}
            </div>
            <div style={{display: "flex"}}>
              <TextField type="date" {...register("fechaPago", { required: true })} style={{ marginBottom: "10px", marginLeft: "10px", marginRight: "20px",}} />
              {errors.fechaPago && <p style={{color: "red"}}>Date is required</p>}
              <Controller
                name="actividad" // Nombre del campo
                control={control}
                defaultValue={null} // Valor inicial (puede ser null u otra opción predeterminada)
                render={({ field }) => (
                  <Select
                    {...field}
                    styles={{width: '100px'}}
                    value={selectedActividad}
                    onChange={(selectedOption) => {
                      setSelectedActividad(selectedOption); // Actualizar el estado con la opción seleccionada
                      field.onChange(selectedOption); // Actualizar el valor en React Hook Form
                    }}
                    options={actividades}
                    isClearable
                    placeholder="Seleccione una Actividad"
                  />
                )}
              />
              <TextField type="text" {...register("monto", { required: true })} label="Monto" fullWidth sx={{ marginBottom: 2, marginLeft: 2 }} />
              {errors.monto && <p style={{color: "red"}}>Username is required</p>}
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
        </Card>
        )  : null}

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
        ) : null}

      </Container>
    </>
  );
}
