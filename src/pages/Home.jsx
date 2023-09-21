import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Card, CardContent, } from '@mui/material';
import { obtenerActividades } from '../api/actividadApi';
import { datosPagos } from '../api/pagoApi';
import IngresosGenerados from '../components/Graphics/IngresosGenerados';
import Actividades from '../components/Graphics/Actividades';
import HomePageCliente from '../components/Diseños/Cliente';

export default function PaginaDashboardApp() {
  const [datosActividades, setDatosActividades] = useState([]);
  const [datosGenerados, setDatosGenerados] = useState([]);

  // Obtener el objeto de usuario desde localStorage
  const localStorageUser = JSON.parse(localStorage.getItem('user'));
  // Extraer el valor de 'tipoRol' del objeto de usuario
  const role = localStorageUser ? localStorageUser.tipoRol : null;

  const obtenerDatos = useCallback(() => {
    obtenerActividades()
      .then((response) => {
        const actividades = response.data;
        const datosFormateados = actividades.map(actividad => {
        // Formatear fechas y calcular duración en días
        const fechaInicio = new Date(actividad.fechaInicio);
        fechaInicio.setHours(fechaInicio.getHours() - 6); // Ajuste de huso horario
        const fechaFinal = new Date(actividad.fechaFinal);
        fechaFinal.setHours(fechaFinal.getHours() - 6); // Ajuste de huso horario
        const duracionMilisegundos = fechaFinal - fechaInicio;
        // Asegurar que la duración sea al menos 1 día
        const duracionDias = Math.max(Math.ceil(duracionMilisegundos / (1000 * 60 * 60 * 24)), 1);

          return {
            nombre: actividad.nombreActividad,
            duracion: duracionDias,
          };
        });
        setDatosActividades(datosFormateados);
      })
      .catch((error) => {
        console.error('Error al obtener actividades', error);
      });

      datosPagos()
      .then((response) => {
        const pagos = response.data;
        const datosMensuales = {};

        pagos.forEach(pago => {
          if (pago.fechaPago !== null) {
            const fechaPago = new Date(pago.fechaPago);
            fechaPago.setHours(fechaPago.getHours() - 6);
            const mes = fechaPago.toLocaleString('es-GT', { month: 'long' });
            if (!datosMensuales[mes]) {
              datosMensuales[mes] = 0;
            }
            datosMensuales[mes] += pago.monto;
          }
        });

        const datosFormateados = Object.keys(datosMensuales).map(mes => ({
          nombre: mes,
          DineroGenerado: datosMensuales[mes],
        }));

        setDatosGenerados(datosFormateados);
      })
      .catch((error) => {
        console.error('Error al obtener datos de pagos', error)
      });
  }, []);

  useEffect(() => {
    obtenerDatos();
  }, [obtenerDatos]);
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
            <IngresosGenerados datosGenerados={datosGenerados} />
            <Actividades datosActividades={datosActividades} />
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