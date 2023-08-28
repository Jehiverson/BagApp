import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Button, TextField, Stack, Card, TableContainer, TablePagination, Table, TableBody, TableRow, TableCell, Checkbox, Paper, } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import swal from 'sweetalert';
import Select from 'react-select';
import axios from 'axios';

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
export default function ProductsPage() {
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
  const PagoRealizado = () => {
    swal({
      title: 'Pago Realizado',
      text: 'Su pago ha sido efectuado',
      icon: 'success',
      timer: '500'
    })
  }
  useEffect(() => {
    async function getActividades() {
      try {
        const response = await axios.get('http://localhost:5000/bagapp-react/us-central1/app/api/actividades');
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
    getActividades();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = {
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
      const response = await axios.post('http://localhost:5000/bagapp-react/us-central1/app/api/pagar', formData);
      console.log('Respuesta del servidor:', response.data);
      // Aquí podrías realizar acciones adicionales dependiendo de la respuesta del servidor
      PagoRealizado();
      settipoPago('');
      setName('');
      setLastName('');
      setState({ fecha: new Date() });
      setMonto('');
      setDescription('');
      setVoucherNumber('');
      setNIT('');
      setSelectedActividad(null);

      const idActividad = selectedActividad.value; // Obtén el idActividad de donde sea necesario
      const idPago = response.data.idPago; // Suponiendo que obtienes el idPago de la respuesta del servidor
      updateIdPagoInActividad(idActividad, idPago);
    } catch (error) {
      console.error('Error al enviar datos:', error);
      // Manejo de errores
    }
  };  
  const updateIdPagoInActividad = async (idActividad, idPago) => {
    try {
      const response = await axios.put(`http://localhost:5000/bagapp-react/us-central1/app/api/actividadpagada/${idActividad}`, {
        idPago: idPago,
      });
      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      console.error("Error al actualizar idPago en actividad:", error);
      // Manejo de errores
    }
  };
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
              <DatePicker selected={state.fecha} onChange={handleFechaChange} customInput={<TextField sx={datePickerStyles} sx={{ mt:2 }} />} />
              <Select value={selectedActividad} onChange={handleActividadChange} options={actividades} fullWidth />
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
      </Container>
    </>
  );
}
