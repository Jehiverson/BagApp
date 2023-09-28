import React, { useCallback } from 'react'; // Importación de React y useCallback
import { Helmet } from 'react-helmet-async'; // Importación de Helmet para el manejo del título de la página
import { Container, Typography, Card, Button } from '@mui/material'; // Importación de componentes de Material-UI
import { toast } from 'react-toastify'; // Importación de la biblioteca react-toastify para notificaciones
import 'react-toastify/dist/ReactToastify.css'; // Importación de estilos para react-toastify
import SliderComponent from '../components/Slider/SliderComponent'; // Importación de un componente Slider personalizado
import { actualizarRangoEdades } from "../api/opcionesAPI"; // Importación de una función para actualizar los rangos de edad desde una API

// Definición del componente OpcionesPage
export default function OpcionesPage() {
  const [edadRango, setedadRango] = React.useState([18, 65]); // Estado local para almacenar el rango de edades

  // Función para cambiar el rango de edades en el estado local
  const cambiarRango = (event, newValue) => {
    setedadRango(newValue);
  };

  // Función para actualizar el rango de edades en la API utilizando useCallback
  const actualizarRango = useCallback(async () => {
    try {
      const [idInicio, idFin] = edadRango;
      await actualizarRangoEdades(idInicio, idFin); // Llama a la función para actualizar el rango de edades en la API
      toast.success('Rango Actualizado'); // Muestra una notificación de éxito
      console.log('Rango de edades guardado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar el rango de edad'); // Muestra una notificación de error
      console.error('Error al guardar el rango de edades:', error);
    }
  }, [edadRango]); // La función se vuelve a crear cuando cambia el valor de edadRango

  return (
    <>
      <Helmet>
        <title>Home</title> {/* Cambia el título de la página */}
      </Helmet>

      <Container maxWidth="xl"> {/* Contenedor de ancho máximo extra grande */}
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hola, Bienvenido a Kingo Energy
        </Typography>
        <Card sx={{ p: 3, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', backgroundColor: 'white' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Bienvenido
          </Typography>
          <div>
            <Typography id="age-range-label">Rango de Edades</Typography>
            <SliderComponent value={edadRango} onChange={cambiarRango} /> {/* Componente Slider para seleccionar un rango de edades */}
          </div>
          <Button variant="contained" onClick={actualizarRango}> {/* Botón para guardar el rango de edades */}
            Guardar Rango
          </Button>
        </Card>
      </Container>
    </>
  );
}
