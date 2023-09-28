import React from 'react';
import { Typography, Grid, Card, CardContent, Container } from '@mui/material';
import IngresosGenerados from '../Graphics/IngresosGenerados';
import Actividades from '../Graphics/Actividades';

// Componente HomePageAdmin que representa la página principal para los administradores.
const HomePageAdmin = () => {
  // Recupera la información del usuario almacenada en el localStorage, si existe.
  const localStorageUser = JSON.parse(localStorage.getItem('user'));
  const user = localStorageUser ? localStorageUser.username : null;

  return (
    // Contenedor principal con un ancho máximo de "lg" (large) proporcionado por Material-UI.
    <Container maxWidth="lg">
      {/* Título de bienvenida que muestra el nombre de usuario si está autenticado. */}
      <Typography variant="h4" gutterBottom>
        ¡Bienvenido, {user}!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Tarjeta principal que contiene dos componentes de gráficos. */}
          <Card elevation={3}>
            <CardContent>
              {/* Componente de gráfico de Ingresos Generados. */}
              <IngresosGenerados />
              {/* Componente de gráfico de Actividades. */}
              <Actividades />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          {/* Espacio en blanco (posiblemente para futuros elementos). */}
        </Grid>
        <Grid item xs={12} md={3}>
          {/* Espacio en blanco (posiblemente para futuros elementos). */}
        </Grid>
        <Grid item xs={12} md={6}>
          {/* Espacio en blanco (posiblemente para futuros elementos). */}
        </Grid>
      </Grid>
    </Container>
  );  
};

export default HomePageAdmin;
