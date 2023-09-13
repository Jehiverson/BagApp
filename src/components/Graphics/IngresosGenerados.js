import React from "react";
import { Typography, Card, CardContent } from "@mui/material";
import { BarChart, Bar, Tooltip, Legend, Cell, XAxis, YAxis } from "recharts";

const IngresosGenerados = ({datosGenerados}) => {
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
        <div style={{width: '100%', maxWidth: '600px'}}>
            <Typography variant="h6">Ingresos Generados</Typography>
            <BarChart width={600} height={300} data={datosGenerados}>
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="DineroGenerado">
                    {datosGenerados.map((entrada, indice) => (
                        <Cell key={`celda-${indice}`} fill={obtenerColor(indice)} />
                    ))}
                </Bar>
            </BarChart>
        </div>
    );
};

export default IngresosGenerados;
