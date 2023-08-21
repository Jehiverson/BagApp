import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Button, TextField, Stack, Card, } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [voucherNumber, setVoucherNumber] = useState('');
  const [name, setName] = useState('');
  const [monto, setMonto] = useState('');
  const [actividad, setActividad] = useState('');
  const [lastName, setLastName] = useState('');
  const [description, setDescription] = useState('');
  const [isVoucher, setIsVoucher] = useState(false);
  const [nit, setNIT] = useState('');
  const [state, setState] = useState({
    fecha: new Date()
  });
  const handleFechaChange = (date) => {
    setState({ ...state, fecha: date });
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
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
  const handleActividadChange = (event) => {
    setActividad(event.target.value);
  }

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleNITChange = (event) => {
    setNIT(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = {
      paymentMethod,
      voucherNumber,
      name,
      lastName,
      fecha: state.fecha,
      actividad,
      monto,
      description,
      nit,
    };
  
    try {
      const response = await axios.post('http://localhost:5000/bagapp-react/us-central1/app/api/pagar', formData);
      console.log('Respuesta del servidor:', response.data);
      // Aquí podrías realizar acciones adicionales dependiendo de la respuesta del servidor
    } catch (error) {
      console.error('Error al enviar datos:', error);
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
                  value={paymentMethod}
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
                    value={voucherNumber}
                    onChange={handleVoucherNumberChange}
                  />
                </FormControl>
              )}
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField label="Nombre" value={name} onChange={handleNameChange} fullWidth />
              <TextField label="Apellido" value={lastName} onChange={handleLastNameChange} fullWidth />
            </Stack>
            <Stack direction="row" spacing={2} alignItems="flex-end">
              <DatePicker selected={state.fecha} onChange={handleFechaChange} customInput={<TextField sx={datePickerStyles} sx={{ mt:2 }} />} />
              <TextField label="N° Actividad" value={actividad} onChange={handleActividadChange} fullWidth />
            </Stack>

            <TextField label="Monto" value={monto} onChange={handleMontoChange} fullWidth sx={{ mt:2 }} />

            <TextField
              label="Descripción"
              value={description}
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
