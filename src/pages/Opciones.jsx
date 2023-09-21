import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Card, Button } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SliderComponent from '../components/Slider/SliderComponent';
import {actualizarRangoEdades} from "../api/opcionesAPI"

export default function OpcionesPage() {
  const [edadRango, setedadRango] = React.useState([18, 65]);

  const cambiarRango = (event, newValue) => {
    setedadRango(newValue);
  };

  const actualizarRango = useCallback(async () => {
    try {
      const [idInicio, idFin] = edadRango;
      await actualizarRangoEdades(idInicio, idFin);
      toast.success('Rango Actualizado');
      console.log('Rango de edades guardado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar el rango de edad');
      console.error('Error al guardar el rango de edades:', error);
    }
  }, [edadRango]);

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hola, Bienvenido a Kingo Energy
        </Typography>
        <Card sx={{ p: 3, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', backgroundColor: 'white' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Bienvenido
          </Typography>
          <div>
            <Typography id="age-range-label">Rango de Edades</Typography>
            <SliderComponent value={edadRango} onChange={cambiarRango} />
          </div>
          <Button variant="contained" onClick={actualizarRango}>
            Guardar Rango
          </Button>
        </Card>
      </Container>
    </>
  );
}