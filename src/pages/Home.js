import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Card, CardContent, CardHeader, } from '@mui/material';
import { BarChart, Bar, PieChart, Pie, Tooltip, Legend, Cell, XAxis, YAxis } from 'recharts';
import Profile from '../_mock/profile';

export default function PaginaDashboardApp() {
  const [datosActividades, setDatosActividades] = useState([]);
  const [datosGenerados, setDatosGenerados] = useState([]);

  useEffect(() => {
    // Obtener datos de actividades
    axios.get('http://localhost:5000/bagapp-5a770/us-central1/app/api/actividades')
      .then(response => {
        const actividades = response.data;
        const datosFormateados = actividades.map(actividad => {
          // Formatear fechas y calcular duración en días
          const fechaInicio = new Date(actividad.fechaInicio);
          fechaInicio.setHours(fechaInicio.getHours() - 6); // Ajuste de huso horario
          const fechaFinal = new Date(actividad.fechaFinal);
          fechaFinal.setHours(fechaFinal.getHours() - 6); // Ajuste de huso horario
          const duracionDias = Math.ceil((fechaFinal - fechaInicio) / (1000 * 60 * 60 * 24));

          return {
            nombre: actividad.nombreActividad,
            duracion: duracionDias,
            color: obtenerColor(),
          };
        });
        setDatosActividades(datosFormateados);
      })
      .catch(error => {
        console.error('Error al obtener actividades:', error);
      });

    // Obtener datos de pagos
    axios.get('http://localhost:5000/bagapp-5a770/us-central1/app/api/pagar')
      .then(response => {
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
      .catch(error => {
        console.error('Error al obtener datos de pagos:', error);
      });
  }, []);

  const obtenerColor = (indice) => {
    const colores = [
      '#8884d8',
      '#82ca9d',
      '#ffc658',
      '#d0ed57',
      '#8884d8',
      '#ffc658',
      '#82ca9d',
      '#d0ed57',
      // Agregar más colores según sea necesario
    ];

    return colores[indice % colores.length];
  };

  return (
    <>
      <Helmet>
        <title>Inicio</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          ¡Hola! Bienvenido a Kingo Energy
        </Typography>
        <Card>
          <CardHeader>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Bienvenido
            </Typography>
          </CardHeader>
          <CardContent sx={{ mb: 2 }}>
            <Profile />
            <br />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: '600px' }}>
                <Typography variant="h6">Ingresos Generados</Typography>
                <BarChart width={600} height={300} data={datosGenerados}>
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="DineroGenerado">
                    {
                      datosGenerados.map((entrada, indice) => (
                        <Cell key={`celda-${indice}`} fill={obtenerColor(indice)} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', margin: '1rem 0' }}>
                <div style={{ width: 'calc(50% - 0.5rem)' }}>
                  <Typography variant="h6">Actividades</Typography>
                  <PieChart width={300} height={200}>
                    <Pie
                      dataKey="duracion"
                      data={datosActividades}
                      outerRadius={80}
                      label
                    >
                      {datosActividades.map((entrada, indice) => (
                        <Cell key={`celda-${indice}`} fill={obtenerColor(indice)} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>
                <Typography variant="body2" sx={{ width: 'calc(50% - 0.5rem)', alignSelf: 'center' }}>
                  Aquí puedes agregar tu párrafo descriptivo.
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}