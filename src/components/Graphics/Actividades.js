import React from "react";
import { Typography, Card, CardContent } from "@mui/material";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

const Actividades = ({ datosActividades }) => {
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
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', margin: '1rem 0' }}>
      <div style={{ width: 'calc(50% - 0.5rem)' }}>
        <Typography variant="h6">Actividades</Typography>
        <PieChart width={300} height={200}>
          <Pie dataKey="duracion" data={datosActividades} outerRadius={80} nameKey="nombre">
            {datosActividades.map((entrada, indice) => (
              <Cell key={`celda-${indice}`} fill={obtenerColor(indice)} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default Actividades;
