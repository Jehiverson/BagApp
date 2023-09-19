import React from "react";
import { Typography } from "@mui/material";
import { BarChart, Bar, Tooltip, Legend, Cell, XAxis, YAxis } from "recharts";

const IngresosGenerados = ({ datosGenerados }) => {
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

  const customStyles = {
    xAxis: {
      fontFamily: "Arial",
      fontSize: 12,
      fontWeight: "bold",
    },
    yAxis: {
      fontFamily: "Arial",
      fontSize: 12,
      fontWeight: "bold",
    },
    bar: {
      borderRadius: 5, // Bordes redondeados para las barras
    },
    legend: {
      fontFamily: "Arial",
      fontSize: 12,
      fontWeight: "bold",
    },
  };

  return (
    <div>
      <Typography variant="h6">Ingresos Generados</Typography>
      <BarChart width={600} height={300} data={datosGenerados}>
        <XAxis dataKey="nombre" tick={customStyles.xAxis} />
        <YAxis tick={customStyles.yAxis} />
        <Tooltip />
        <Legend wrapperStyle={customStyles.legend} />
        <Bar dataKey="DineroGenerado" fill="#8884d8" shape={<RoundBar />} >
          {datosGenerados.map((entrada, indice) => (
            <Cell key={`celda-${indice}`} fill={obtenerColor(indice)} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
};

// Componente personalizado para las barras redondeadas
const RoundBar = ({ fill, x, y, width, height }) => {
    const borderSize = 2; // Tamaño del borde
    return (
      <>
        {/* Barras redondeadas */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={5} // Radio de esquinas redondeadas
          ry={5}
          fill={fill}
        />
        {/* Borde alrededor de las barras */}
        <rect
          x={x - borderSize / 2} // Ajustar la posición x para el borde
          y={y - borderSize / 2} // Ajustar la posición y para el borde
          width={width + borderSize} // Ajustar el ancho para el borde
          height={height + borderSize} // Ajustar la altura para el borde
          rx={5 + borderSize / 2} // Radio de esquinas redondeadas del borde
          ry={5 + borderSize / 2}
          fill="none"
          stroke={fill} // Usar el mismo color que la barra para el borde
          strokeWidth={borderSize} // Tamaño del borde
        />
      </>
    );
  };  

export default IngresosGenerados;
