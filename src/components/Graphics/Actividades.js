import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { obtenerActividades } from '../../api/actividadApi';

const Actividades = () => {
  const [datosActividades, setDatosActividades] = useState({ pendientes: [], completadas: [] });

  // Llama a la API y formatea los datos al cargar el componente
  useEffect(() => {
    obtenerActividades()
      .then((response) => {
        const actividades = response.data;
        // Filtra actividades solo para el mes actual y estado "Pendiente"
        const actividadesPendientes = actividades.filter(
          (actividad) =>
            actividad.estadoActividad === 'Pendiente' &&
            new Date(actividad.fechaEntrega).getMonth() >= new Date().getMonth()
        );

        // Filtra actividades solo para el mes actual y estado "Completado"
        const actividadesCompletadas = actividades.filter(
          (actividad) =>
            actividad.estadoActividad === 'Completa' &&
            new Date(actividad.fechaEntrega).getMonth() >= new Date().getMonth()
        );

        // Reformatea los datos para que coincidan con lo que espera la gráfica de pastel
        const datosPendientes = actividadesPendientes.map((actividad) => ({
          nombre: actividad.nombreActividad,
          duracion: 1, // Puedes ajustar esto según tus necesidades
        }));

        const datosCompletadas = actividadesCompletadas.map((actividad) => ({
          nombre: actividad.nombreActividad,
          duracion: 1, // Puedes ajustar esto según tus necesidades
        }));

        setDatosActividades({
          pendientes: datosPendientes,
          completadas: datosCompletadas,
        });
      })
      .catch((error) => {
        console.error('Error al obtener actividades', error);
      });
  }, []);

  if (!datosActividades.pendientes.length && !datosActividades.completadas.length) {
    // Puedes mostrar un mensaje de carga o manejar el estado de carga aquí
    return <div>Cargando...</div>;
  }

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
        <Typography variant="h6">Actividades Pendientes</Typography>
        <PieChart width={400} height={400}>
          <Pie
            dataKey="duracion"
            data={datosActividades.pendientes}
            outerRadius={100}
            fill="#8884d8"
            label={({ nombre }) => nombre} // Utiliza el campo "nombre" de tus datos
          >
            {datosActividades.pendientes.map((entrada, indice) => (
              <Cell key={`celda-pendiente-${indice}`} fill={obtenerColor(indice)} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} /> {/* Usar el componente personalizado para el tooltip */}
        </PieChart>
      </div>
      <div style={{ width: 'calc(50% - 0.5rem)' }}>
        <Typography variant="h6">Actividades Completadas</Typography>
        <PieChart width={400} height={400}>
          <Pie
            dataKey="duracion"
            data={datosActividades.completadas}
            outerRadius={100}
            fill="#82ca9d"
            label={({ nombre }) => nombre} // Utiliza el campo "nombre" de tus datos
          >
            {datosActividades.completadas.map((entrada, indice) => (
              <Cell key={`celda-completada-${indice}`} fill={obtenerColor(indice)} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} /> {/* Usar el componente personalizado para el tooltip */}
        </PieChart>
      </div>
    </div>
  );
};

export default Actividades;
