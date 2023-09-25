import React from 'react';
import { Typography, Grid, Card, CardContent, Container } from '@mui/material';
import IngresosGenerados from '../Graphics/IngresosGenerados';
import Actividades from '../Graphics/Actividades';

const HomePageAdmin = () => {
  const localStorageUser = JSON.parse(localStorage.getItem('user'));
  const user = localStorageUser ? localStorageUser.username : null;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        ¡Bienvenido, {user}!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
                <IngresosGenerados />
                <Actividades />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
                {/* Espacio en blanco */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          {/* Espacio en blanco */}
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
                {/* Espacio en blanco */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );  
};

export default HomePageAdmin;
