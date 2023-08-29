import React from 'react';
import './plantillaPDF.css';

const PlantillaPDF = ({ pdf }) => {
  return (
    <div className="pdf-container">
      <div className="pdf-header">
        <h1>Reporte de Actividades Entregadas</h1>
        <div className="pdf-textarea">
          <h4>Reporte Generado:</h4>
          <h4>Fecha: 2023-08-01</h4>
          <h4>hasta la fecha: 2023-08-31</h4>
        </div>
      </div>
      <div className="pdf-table">
        <table className="content-table"> {/* Cambio realizado aquí */}
          <thead>
            <tr>
              <th>N° Actividad</th>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Fecha Entrega</th>
              <th>Estado</th>
              <th>Cliente</th>
              <th>N° Pago</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Actividad 1</td>
              <td>Actividad prueba</td>
              <td>2023-08-13</td>
              <td>Completa</td>
              <td>Aroldo</td>
              <td>12487</td>
            </tr>
            <tr className="active-row">
              <td>2</td>
              <td>Actividad 2</td>
              <td>Probando</td>
              <td>2023-08-22</td>
              <td>Completa</td>
              <td>David</td>
              <td>78915</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Actividad 3</td>
              <td>Prueba de todo</td>
              <td>2023-09-12</td>
              <td>Completa</td>
              <td>Escobar</td>
              <td>44516</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlantillaPDF;
