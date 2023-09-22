import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent } from '@mui/material';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { obtenerActividades } from '../../api/actividadApi';

const Actividades = () => {
  const [datosActividades, setDatosActividades] = useState([]);

  // Llama a la API y formatea los datos al cargar el componente
  useEffect(() => {
    obtenerActividades()
      .then((response) => {
        const actividades = response.data;
        const datosFormateados = actividades.map((actividad) => {
          // Formatear fechas y calcular duración en días
          const fechaInicio = new Date(actividad.fechaInicio);
          fechaInicio.setHours(fechaInicio.getHours() - 6); // Ajuste de huso horario
          const fechaFinal = new Date(actividad.fechaFinal);
          fechaFinal.setHours(fechaFinal.getHours() - 6); // Ajuste de huso horario
          const duracionMilisegundos = fechaFinal - fechaInicio;
          // Asegurar que la duración sea al menos 1 día
          const duracionDias = Math.max(
            Math.ceil(duracionMilisegundos / (1000 * 60 * 60 * 24)),
            1
          );

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

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: 'white', padding: '8px', border: '1px solid #ccc' }}>
          <p>{data.nombre}</p>
          <p>Duración: {data.duracion} días</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', margin: '1rem 0' }}>
      <div style={{ width: 'calc(50% - 0.5rem)' }}>
        <Typography variant="h6">Actividades</Typography>
        <PieChart width={600} height={400}>
          <Pie
            dataKey="duracion"
            data={datosActividades}
            outerRadius={100}
            fill="#8884d8"
            label={({ nombre }) => nombre} // Utiliza el campo "nombre" de tus datos
          >
            {datosActividades.map((entrada, indice) => (
              <Cell key={`celda-${indice}`} fill={obtenerColor(indice)} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} /> {/* Usar el componente personalizado para el tooltip */}
        </PieChart>
      </div>
    </div>
  );
};

export default Actividades;
