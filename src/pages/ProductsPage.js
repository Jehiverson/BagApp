import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Button, TextField, Stack } from '@mui/material';

export default function ProductsPage() {
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [voucherNumber, setVoucherNumber] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [description, setDescription] = useState('');
  const [isNIT, setIsNIT] = useState(false);
  const [nit, setNIT] = useState('');

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleVoucherNumberChange = (event) => {
    setVoucherNumber(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleNITOptionChange = (event) => {
    setIsNIT(event.target.value === 'nit');
    setNIT('');
  };

  const handleNITChange = (event) => {
    setNIT(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Aquí puedes implementar la lógica para procesar el pago según el método seleccionado
    if (paymentMethod === 'voucher') {
      console.log('Número de voucher:', voucherNumber);
      // Lógica para procesar el pago con voucher
    } else {
      console.log('Pago en efectivo');
      // Lógica para procesar el pago en efectivo
    }

    console.log('Nombre:', name);
    console.log('Apellido:', lastName);
    console.log('Descripción:', description);
    console.log('Es NIT:', isNIT);
    console.log('NIT:', nit);
  };

  return (
    <>
      <Helmet>
        <title> Pagos </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Pagos
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl component="fieldset">
              <RadioGroup aria-label="payment-method" name="paymentMethod" value={paymentMethod} onChange={handlePaymentMethodChange}>
                <FormControlLabel value="efectivo" control={<Radio />} label="Efectivo" />
                <FormControlLabel value="voucher" control={<Radio />} label="Voucher" />
              </RadioGroup>
            </FormControl>

            {paymentMethod === 'voucher' && (
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

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <TextField
              label="Nombre"
              value={name}
              onChange={handleNameChange}
              fullWidth
            />

            <TextField
              label="Apellido"
              value={lastName}
              onChange={handleLastNameChange}
              fullWidth
            />

            <TextField
              label="Descripción"
              value={description}
              onChange={handleDescriptionChange}
              fullWidth
              multiline
              rows={4}
            />
          </Stack>

          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <RadioGroup aria-label="nit-option" name="nitOption" value={isNIT ? 'nit' : 'cf'} onChange={handleNITOptionChange}>
              <FormControlLabel value="nit" control={<Radio />} label="NIT" />
              <FormControlLabel value="cf" control={<Radio />} label="C/F" />
            </RadioGroup>
          </FormControl>

          {isNIT && (
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

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Pagar
          </Button>
        </form>
      </Container>
    </>
  );
}
