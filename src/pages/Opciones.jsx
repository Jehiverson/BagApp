import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Card, Button } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SliderComponent from '../components/Slider/SliderComponent';
import SelectComponent from '../components/Select/SelectComponent';
import {actualizarRangoEdades, cambiarActividad} from "../api/opcionesAPI"
import { obtenerActividades } from '../api/actividadApi';

export default function OpcionesPage() {
  const [edadRango, setedadRango] = React.useState([18, 65]);
  const [selectedActividad, setSelectedActividad] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [selectedCambio, setSelectedCambio] = useState(null);
  const [cambio, setCambio] = useState([]);
  const menuPortalTargetRef = useRef(null);

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

  const handleActividadChange = (selectedOption) => {
    setSelectedActividad(selectedOption);
  };

  const handleCambioChange = (selectedOption) => {
    setSelectedCambio(selectedOption);
  };

  const handleCambiarClick = useCallback(async () => {
    if (selectedActividad && selectedActividad.value !== 0 && selectedCambio && selectedCambio.value !== 0) {
      const idActividadOrigen = selectedActividad.value;
      const idActividadDestino = selectedCambio.value;
      const idPago = selectedActividad.idPago; // Obtener idPago de la actividad de origen
  
      console.log('ID de actividad de origen:', idActividadOrigen);
      console.log('ID de actividad de destino:', idActividadDestino);
      console.log('ID de pago:', idPago); // Añadir un log para verificar que obtienes idPago
  
      try {
        await cambiarActividad(idActividadOrigen, idActividadDestino, idPago);
        console.log('Actividades actualizadas exitosamente');
        toast.success('Cambio exitoso!');
        // Realiza cualquier acción adicional que desees después de la actualización
      } catch (error) {
        console.error('Error al actualizar las actividades:', error);
        toast.error('No se realizó ningún cambio');
      }
    }
  }, [selectedActividad, selectedCambio]); // Dependencias corregidas  

  useEffect(() => {
    async function getActividades() {
      try {
        const response = await obtenerActividades();
        const actividadData = response.data;

        // Filtrar actividades pagadas y no pagadas
        const actividadesPagadas = actividadData.filter(actividad => actividad.idPago !== null && actividad.idPago !== "");
        const actividadesNoPagadas = actividadData.filter(actividad => actividad.idPago === null || actividad.idPago === "");

        const actividadesPagadasFormatted = actividadesPagadas.map(actividad => ({
          value: actividad.idActividad,
          label: actividad.nombreActividad,
          idPago: actividad.idPago, // Agregar idPago a la respuesta
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
          <div>
            <Typography id="age-range-label">Rango de Edades</Typography>
            <SliderComponent value={edadRango} onChange={cambiarRango} />
          </div>
          <Button variant="contained" onClick={actualizarRango}>
            Guardar Rango
          </Button>
        </Card>
        <br />
        <div ref={menuPortalTargetRef} />
        <Card sx={{ p: 3, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', backgroundColor: 'white' }}>
          <div>
            <Typography variant="h6">Cambio de Actividad</Typography>
            <div style={{ width: '100%', minWidth: 10, marginTop: '25px' }}>
              <SelectComponent
                value={selectedActividad}
                onChange={handleActividadChange}
                options={actividades}
                menuPortalTarget={menuPortalTargetRef.current}
              />
            </div>
            <br />
            <div style={{ marginTop: '25px' }}>
              <SelectComponent
                value={selectedCambio}
                onChange={handleCambioChange}
                options={cambio}
                menuPortalTarget={menuPortalTargetRef.current}
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