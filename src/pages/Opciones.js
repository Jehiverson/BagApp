import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Card, Slider, Button } from '@mui/material';
import Select from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function OpcionesPage() {
  const [ageRange, setAgeRange] = React.useState([18, 65]);
  const [selectedActividad, setSelectedActividad] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [selectedCambio, setSelectedCambio] = useState(null);
  const [cambio, setCambio] = useState([]);
  const menuPortalTargetRef = useRef(null);

  const handleSliderChange = (event, newValue) => {
    setAgeRange(newValue);
  };

  const handleSaveRange = () => {
    const [idInicio, idFin] = ageRange;
    const requestData = { idInicio, idFin };

    axios
      .put('http://localhost:5000/bagapp-5a770/us-central1/app/api/rango/1', requestData)
      .then(response => {
        console.log('Rango de edades guardado exitosamente:', response.data);
      })
      .catch(error => {
        console.error('Error al guardar el rango de edades:', error);
      });
  };

  const handleActividadChange = (selectedOption) => {
    setSelectedActividad(selectedOption);
  };

  const handleCambioChange = (selectedOption) => {
    setSelectedCambio(selectedOption);
  };

  const handleCambiarClick = () => {
    if (selectedActividad && selectedActividad.value !== 0) {
      // Realizar la actualización del estado de pago aquí
      const actividadId = selectedActividad.value;
      console.log('ID de actividad seleccionada:', actividadId);
      // Agregar un console.log para verificar la actividad seleccionada para el cambio
      console.log('Actividad seleccionada para el cambio:', selectedActividad);
      axios
        .put(`http://localhost:5000/bagapp-5a770/us-central1/app/cambio/${actividadId}`, {})
        .then(response => {
          console.log('Actividades actualizadas exitosamente:', response.data);
          toast.success("Cambio exitoso!");
        })
        .catch(error => {
          console.error('Error al actualizar las actividades:', error);
          toast.error("No se realizo ningun cambio");
        });
    } else {
      console.warn('Selecciona una actividad válida antes de cambiar el estado de pago.');
    }
  };

  useEffect(() => {
    async function getActividades() {
      try {
        const response = await axios.get('http://localhost:5000/bagapp-5a770/us-central1/app/api/actividades');
        const actividadData = response.data;

        // Filtrar actividades pagadas y no pagadas
        const actividadesPagadas = actividadData.filter(actividad => actividad.idPago !== null && actividad.idPago !== "");
        const actividadesNoPagadas = actividadData.filter(actividad => actividad.idPago === null || actividad.idPago === "");

        const actividadesPagadasFormatted = actividadesPagadas.map(actividad => ({
          value: actividad.idActividad,
          label: actividad.nombreActividad
        }));

        const actividadesNoPagadasFormatted = actividadesNoPagadas.map(actividad => ({
          value: actividad.idActividad,
          label: actividad.nombreActividad
        }));

        actividadesPagadasFormatted.unshift({
          value: 0,
          label: 'Seleccione una Actividad'
        });

        actividadesNoPagadasFormatted.unshift({
          value: 0,
          label: 'Seleccione una Actividad'
        });

        setActividades(actividadesPagadasFormatted);
        setCambio(actividadesNoPagadasFormatted);
      } catch (error) {
        console.error('Error al obtener las actividades:', error);
      }
    }

    getActividades();
  }, []);

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
          <Typography variant="h6">Configuración de Rango de Edades</Typography>
          <div>
            <Typography id="age-range-label">Rango de Edades</Typography>
            <Slider
              value={ageRange}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              aria-labelledby="age-range-label"
              min={0}
              max={100}
            />
          </div>
          <Button variant="contained" onClick={handleSaveRange}>
            Guardar Rango
          </Button>
        </Card>
        <br />
        <div ref={menuPortalTargetRef} />
        <Card sx={{ p: 3, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', backgroundColor: 'white' }}>
          <div>
            <Typography variant="h6">Cambio de Actividad</Typography>
            <div style={{ width: '100%', minWidth: 10, marginTop: "25px" }}>
              <Select
                value={selectedActividad}
                onChange={handleActividadChange}
                options={actividades}
                fullWidth
                menuPortalTarget={menuPortalTargetRef.current} // Mueve el menú emergente fuera del Card
              />
            </div>
            <br />
            <div style={{marginTop: "25px"}}>
              <Select
                value={selectedCambio}
                onChange={handleCambioChange}
                options={cambio}
                fullWidth
                menuPortalTarget={menuPortalTargetRef.current} // Mueve el menú emergente fuera del Card
              />
            </div>
            <br />
            <div style={{marginTop: "25px"}}>
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCambiarClick}>Cambiar</Button>
            </div>
          </div>
        </Card>
      </Container>
    </>
  );
}
