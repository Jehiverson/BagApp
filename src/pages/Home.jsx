import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Card, CardContent, } from '@mui/material';
import IngresosGenerados from '../components/Graphics/IngresosGenerados';
import Actividades from '../components/Graphics/Actividades';
import HomePageCliente from '../components/Diseños/Cliente';

export default function PaginaDashboardApp() {

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
          {role === 'Administrador' ? (
            <Card sx={{ p: 3, boxShadow: 3, backgroundColor: 'white' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Bienvenido
            </Typography>
          <CardContent sx={{ mb: 2 }}>
            <IngresosGenerados />
            <Actividades />
          </CardContent>
        </Card>
          ) : null}
          {role === 'Cliente' ? (
            <div>
              <HomePageCliente />
            </div>
          ) : null}
          {role === 'Usuario' ? (
            <div>Hola Usuario</div>
          ) : null}
        </Container>
      </>
  );
}