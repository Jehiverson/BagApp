import React, { useState, useEffect } from 'react';
import { Typography } from "@mui/material";
import { LineChart, Line, Tooltip, Legend, XAxis, YAxis, CartesianGrid } from "recharts";
import { datosPagos } from '../../api/pagoApi';

const IngresosGenerados = () => {
  const [datosGenerados, setDatosGenerados] = useState([]);
  const [datosCargados, setDatosCargados] = useState(false); // Estado para controlar si los datos ya han sido cargados

  useEffect(() => {
    if (!datosCargados) { // Solo realiza la petición si los datos no han sido cargados
      datosPagos()
        .then((response) => {
          const pagos = response.data;
          const datosMensuales = {};

          pagos.forEach(pago => {
            const fechaPago = new Date(pago.createdAt || pago.fechaPago);
            fechaPago.setHours(fechaPago.getHours() - 6);
            const mes = fechaPago.toLocaleString('es-GT', { month: 'long' });
            if (!datosMensuales[mes]) {
              datosMensuales[mes] = 0;
            }
            datosMensuales[mes] += pago.monto;
          });

          const datosFormateados = Object.keys(datosMensuales).map((mes, indice) => ({
            nombre: mes,
            DineroGenerado: datosMensuales[mes],
          }));

          setDatosGenerados(datosFormateados);
          setDatosCargados(true); // Marca los datos como cargados
        })
        .catch((error) => {
          console.error('Error al obtener datos de pagos', error);
        });
    }
  }, [datosCargados]); // Ejecuta la petición solo cuando cambie el estado datosCargados

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
    legend: {
      fontFamily: "Arial",
      fontSize: 12,
      fontWeight: "bold",
    },
  };

  return (
    <div>
      <Typography variant="h6">Ingresos Generados</Typography>
      <LineChart width={800} height={300} data={datosGenerados}>
        <XAxis dataKey="nombre" tick={customStyles.xAxis} />
        <YAxis tick={customStyles.yAxis} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend wrapperStyle={customStyles.legend} />
        <Line type="monotone" dataKey="DineroGenerado" strokeWidth={2} dot={{ r: 5 }} stroke="#8884d8" name="Ingresos" />
      </LineChart>
    </div>
  );
};

export default IngresosGenerados;
