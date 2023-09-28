import React, { useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent, Container } from '@mui/material';
import moment from 'moment';
import { obtenerActividades } from '../../api/actividadApi'; // Importación de la función para obtener actividades desde una API
import { obtenerPagos } from '../../api/pagoApi'; // Importación de la función para obtener pagos desde una API

const HomePageCliente = () => {
  // Estado local para almacenar las actividades pasadas
  const [actividadesPasadas, setActividadesPasadas] = useState([]);
  // Estado local para almacenar la fecha actual utilizando Moment.js
  const [hoy] = useState(moment());
  // Obtiene el usuario almacenado en el localStorage, si existe
  const localStorageUser = JSON.parse(localStorage.getItem('user'));
  const user = localStorageUser ? localStorageUser.username : null;
  const cliente = localStorageUser ? localStorageUser.idCliente : null;

  // Estado local para almacenar las actividades
  const [actividades, setActividades] = useState([]);
  // Estado local para almacenar los pagos
  const [pagos, setPagos] = useState([]);
  // Estado local para rastrear si los datos ya se cargaron
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // Función asincrónica para obtener actividades desde la API
    async function fetchActividades() {
      try {
        const responseActividades = await obtenerActividades();
        const actividadData = responseActividades.data;
        setActividades(actividadData);
      } catch (error) {
        console.error('Error al obtener las actividades:', error);
      }
    }

    // Función asincrónica para obtener pagos desde la API
    async function fetchPagos() {
      try {
        const response = await obtenerPagos();
        const pagoData = response.data;
        // Filtra los pagos del cliente actual
        const pagosCliente = pagoData.filter((pago) => parseInt(pago.idCliente, 10) === parseInt(cliente, 10));
        setPagos(pagosCliente);
      } catch (error) {
        console.error('Error al obtener los pagos:', error);
      }
    }

    // Verifica si los datos ya se cargaron antes de ejecutar las llamadas a la API
    if (!dataLoaded) {
      fetchActividades(); // Llama a la función para obtener actividades
      fetchPagos(); // Llama a la función para obtener pagos
      setDataLoaded(true); // Marca que los datos se han cargado
    }

    // Calcula las actividades pasadas y las filtra
    const actividadesFiltradas = actividades.filter((actividad) => {
      const fechaEntrega = moment(actividad.fechaEntrega);
      return fechaEntrega.isAfter(hoy);
    });

    setActividadesPasadas(actividadesFiltradas); // Actualiza el estado local con las actividades pasadas
  }, [hoy, actividades, cliente, dataLoaded]);

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

  // Función para obtener actividades pasadas del mes actual
  const obtenerActividadesPasadasDelMes = () => {
    const actividadesPasadasDelMes = actividades.filter((actividad) => {
      const fechaEntrega = moment(actividad.fechaEntrega);
      return fechaEntrega.isBefore(hoy) && fechaEntrega.isSame(hoy, 'month');
    });
    return actividadesPasadasDelMes;
  };

  // Obtiene las actividades pasadas del mes actual
  const actividadesPasadasDelMes = obtenerActividadesPasadasDelMes();

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
              <Typography variant="h6">Actividades Pasadas del Mes</Typography>
              {actividadesPasadasDelMes.map((actividad, index) => (
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
