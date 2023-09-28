import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography } from '@mui/material';
import HomePageCliente from '../components/Diseños/Cliente';
import HomePageAdmin from '../components/Diseños/Administrador';

export default function Home() {

  // Obtener el objeto de usuario desde localStorage
  const localStorageUser = JSON.parse(localStorage.getItem('user'));
  // Extraer el valor de 'tipoRol' del objeto de usuario
  const role = localStorageUser ? localStorageUser.tipoRol : null;
  return (
    <>
        <Helmet>
          <title>Inicio</title>
        </Helmet>

        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 5 }}>
            ¡Hola! Bienvenido a Kingo Energy
          </Typography>
          {role === 'Administrador' || role === 'Usuario' ? (
          <div>
            <HomePageAdmin />
          </div>
          ) : null}
          {role === 'Cliente' ? (
            <div>
              <HomePageCliente />
            </div>
          ) : null}
        </Container>
      </>
  );
}