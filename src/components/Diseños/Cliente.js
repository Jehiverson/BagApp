import React, { useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent, Container } from '@mui/material';
import moment from 'moment';
import { obtenerActividades } from '../../api/actividadApi';
import { obtenerPagos } from '../../api/pagoApi';

const HomePageCliente = () => {
  const [actividadesPasadas, setActividadesPasadas] = useState([]);
  const [hoy] = useState(moment()); // Obtener la fecha actual
  // Obtener el objeto de usuario desde localStorage
  const localStorageUser = JSON.parse(localStorage.getItem('user'));
  // Extraer el valor de 'tipoRol' del objeto de usuario
  const user = localStorageUser ? localStorageUser.username : null;
  const cliente = localStorageUser ? localStorageUser.idCliente : null;
  const [actividades, setActividades] = useState([]);
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const responseActividades = await obtenerActividades();
        const actividadData = responseActividades.data;
        setActividades(actividadData);
      } catch (error) {
        console.error('Error al obtener las actividades:', error);
      }
    }
  
    async function pagosData() {
      try {
        const response = await obtenerPagos();
        const pagoData = response.data;
  
        // Filtra los pagos por el idCliente del usuario actual
        const pagosCliente = pagoData.filter((pago) => pago.idCliente === cliente);
  
        setPagos(pagosCliente);
      } catch (error) {
        console.error('Error al obtener los pagos:', error);
      }
    }
  
    fetchData();
    pagosData();
  
    setActividadesPasadas(actividadesFiltradas);
  }, [hoy, actividades, cliente]);  

  // Filtra los pagos del mes actual
  const pagosDelMes = pagos.filter((pago) => {
    const createdAt = moment(pago.createdAt);
    return createdAt.isSame(hoy, 'month');
  });
  // Filtra las actividades que aún no han pasado
  const actividadesFiltradas = actividades.filter((actividad) => {
    const fechaEntrega = moment(actividad.fechaEntrega);
    return fechaEntrega.isAfter(hoy);
  });

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        ¡Bienvenido, {user}!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Calendario de Actividades</Typography>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {actividadesFiltradas.map((actividad, index) => (
                  <li
                    key={index}
                    style={{
                      backgroundColor: getColorForActivity(index),
                      color: 'black',
                      padding: '10px',
                      marginBottom: '10px',
                      borderRadius: '5px',
                    }}
                  >
                    <strong>Nombre de la Actividad:</strong> {actividad.nombreActividad}
                    <br />
                    <strong>Fecha de Inicio:</strong> {convertirFechaAC(actividad.fechaInicio)}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Historial de Pagos</Typography>
              {pagosDelMes.map((pago, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '10px',
                    backgroundColor: getColorForActivity(index),
                    color: 'black',
                    padding: '5px',
                    borderRadius: '5px',
                  }}
                >
                  {`${pago.nombre} ${pago.apellido}`}
                </div>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          {/* Espacio en blanco */}
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Actividades Pasadas</Typography>
              {actividadesPasadas.map((actividad, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '10px',
                    backgroundColor: getColorForActivity(index),
                    color: 'black',
                    padding: '5px',
                    borderRadius: '5px',
                  }}
                >
                  {actividad.nombreActividad}
                </div>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );  
};

// Función para asignar un color de la paleta fría a cada actividad
function getColorForActivity(index) {
  const coolColors = ['#B4E6C1', '#AEDFF7', '#B9E3F5', '#D0E5F6', '#C3DFF4'];
  return coolColors[index % coolColors.length];
}

// Función para convertir una fecha UTC a la fecha local de América Central
function convertirFechaAC(fechaUTC) {
    const fechaLocal = new Date(fechaUTC);
    const options = { timeZone: 'America/El_Salvador', year: 'numeric', month: 'numeric', day: 'numeric' };
    return fechaLocal.toLocaleString(undefined, options);
}

export default HomePageCliente;
