import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography } from '@mui/material';
import { Card, CardTitle, CardBody, CardFooter, CardHeader } from 'reactstrap';
import { BarChart, Bar, PieChart, Pie, Tooltip, Legend, Cell, XAxis, YAxis, } from 'recharts';

export default function DashboardAppPage() {
  const moneyGeneratedData = [
    { name: 'Enero', DineroGenerado: 5000 },
    { name: 'Febrero', DineroGenerado: 8000 },
    { name: 'Marzo', DineroGenerado: 6000 },
    { name: 'Abril', DineroGenerado: 9000 },
    { name: 'Mayo', DineroGenerado: 7000 },
  ];

  const activitiesData = [
    { name: 'Actividad 1', value: 15 },
    { name: 'Actividad 2', value: 25 },
    { name: 'Actividad 3', value: 30 },
    { name: 'Actividad 4', value: 10 },
  ];

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
        <title> Home </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hola, Bienvenido a Kingo Energy
        </Typography>
        <Card>
          <CardHeader>
            <CardTitle>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Bienvenido
              </Typography>
            </CardTitle>
          </CardHeader>
          <CardBody sx={{ mb: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '30%' }}>
                <Typography variant="h6">Dinero Generado</Typography>
                <BarChart width={300} height={200} data={moneyGeneratedData}>
                  <Bar dataKey="DineroGenerado" fill="rgba(75, 192, 192, 0.6)" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                </BarChart>
              </div>
              <div style={{ width: '30%' }}>
                <Typography variant="h6">Actividades</Typography>
                <PieChart width={400} height={300}>
                  <Pie
                    dataKey="value"
                    data={activitiesData}
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {activitiesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
              <div style={{ width: '30%' }}>
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
          </CardBody>
          <CardFooter>Fin del Card</CardFooter>
        </Card>
      </Container>
    </>
  );
}
