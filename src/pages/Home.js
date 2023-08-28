import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Card, CardContent, CardHeader } from '@mui/material';
import { BarChart, Bar, PieChart, Pie, Tooltip, Legend, Cell, XAxis, YAxis } from 'recharts';

export default function DashboardAppPage() {
  const [actividadesData, setActividadesData] = useState([]);
  const [moneyGeneratedData, setMoneyGeneratedData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/bagapp-5a770/us-central1/app/api/actividades')
      .then(response => {
        const actividad = response.data;
        const formattedData = actividad.map(actividad => {
          const startDate = new Date(actividad.fechaInicio);
          startDate.setHours(startDate.getHours() - 6); // Ajustar para el huso horario de Guatemala
          const endDate = new Date(actividad.fechaFinal);
          endDate.setHours(endDate.getHours() - 6); // Ajustar para el huso horario de Guatemala
          const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
          return {
            name: actividad.nombreActividad,
            value: days,
            color: getColor(),
          };
        });
        setActividadesData(formattedData);
      })
      .catch(error => {
        console.error('Error al obtener actividades:', error);
      });

    axios.get('http://localhost:5000/bagapp-5a770/us-central1/app/api/pagar')
      .then(response => {
        const pagos = response.data;
        const monthlyData = {}; // Objeto para almacenar los datos por mes

        pagos.forEach(pago => {
          if (pago.fechaPago !== null) {
            const paymentDate = new Date(pago.fechaPago);
            paymentDate.setHours(paymentDate.getHours() - 6);
            const month = paymentDate.toLocaleString('es-GT', { month: 'long' });
            if (!monthlyData[month]) {
              monthlyData[month] = 0;
            }
            monthlyData[month] += pago.monto;
          }
        });

        const formattedData = Object.keys(monthlyData).map(month => ({
          name: month,
          DineroGenerado: monthlyData[month],
        }));

        setMoneyGeneratedData(formattedData);
      })
      .catch(error => {
        console.error('Error al obtener datos de pagos:', error);
      });
  }, []);

  const getColor = (index) => {
    const colors = [
      '#8884d8',
      '#82ca9d',
      '#ffc658',
      '#d0ed57',
      '#8884d8',
      '#ffc658',
      '#82ca9d',
      '#d0ed57',
      // Agrega más colores según necesites
    ];

    return colors[index % colors.length];
  };

  const reportsGeneratedData = [
    { name: 'Enero', ReportesGenerados: 10 },
    { name: 'Febrero', ReportesGenerados: 8 },
    { name: 'Marzo', ReportesGenerados: 12 },
    { name: 'Abril', ReportesGenerados: 6 },
    { name: 'Mayo', ReportesGenerados: 9 },
  ];

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hola, Bienvenido a Kingo Energy
        </Typography>
        <Card>
          <CardHeader>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Bienvenido
            </Typography>
          </CardHeader>
          <CardContent sx={{ mb: 2 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: '1 1 30%' }}>
                <Typography variant="h6">Dinero Generado</Typography>
                <BarChart width={300} height={200} data={moneyGeneratedData}>
                  <Bar dataKey="DineroGenerado" fill={getColor()} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                </BarChart>
              </div>
              <div style={{ flex: '1 1 30%' }}>
                <Typography variant="h6">Actividades</Typography>
                <PieChart width={400} height={300}>
                  <Pie
                    dataKey="value"
                    data={actividadesData}
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {actividadesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getColor(index)} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
              <div style={{ flex: '1 1 30%' }}>
                <Typography variant="h6">Reportes Generados</Typography>
                <BarChart width={300} height={200} data={reportsGeneratedData}>
                  <Bar dataKey="ReportesGenerados" fill="rgba(54, 162, 235, 0.6)" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                </BarChart>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
