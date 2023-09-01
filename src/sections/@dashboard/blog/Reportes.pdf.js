import React, { useState } from 'react';
import { Button, Modal, Paper, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format, parseISO } from 'date-fns';
import logo from './pdf/logo_pdf.png';

const ReportePDF = ({ dataReporte }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    fechaInicio: '',
    fechaFinal: '',
    filtroEstado: 'todos', // Opciones: 'todos', 'Completa', 'Pendiente'
  });

  const getTitle = () => 'BANCO DE ALIMENTOS DE GUATEMALA - BASE DE DATOS DE BENEFICIARIOS';
  const getTitulo = () => {
    const nombreOrganizacion = 'Nombre de la Organización:____________';
    const lugarEntrega = 'Lugar de entrega:________________manz 21 lote 8 sec, 2 Tierra Nueva 1';
    const responsabilidadProyecto = 'Responsabilidad del Proyecto:_________';
  
    return `${nombreOrganizacion}          Fecha entrega:          ${lugarEntrega}          ${responsabilidadProyecto}`;
  };

  const handleGeneratePDF = () => {
    const { fechaInicio, fechaFinal, filtroEstado } = newEvent;

    let filteredActivities = [...dataReporte];

    if (filtroEstado === 'Completa') {
      filteredActivities = filteredActivities.filter((actividad) => actividad.estadoActividad === 'Completa');
    } else if (filtroEstado === 'Pendiente') {
      filteredActivities = filteredActivities.filter((actividad) => actividad.estadoActividad === 'Pendiente');
    }

    const startDate = parseISO(`${fechaInicio}T00:00:00.000-06:00`);
    const endDate = parseISO(`${fechaFinal}T23:59:59Z`);

    filteredActivities = filteredActivities.filter(
      (actividad) => parseISO(actividad.fechaEntrega) >= startDate && parseISO(actividad.fechaEntrega) <= endDate
    );

    const doc = new jsPDF('landscape');

    // Agregar imagen como marca de agua en la esquina superior izquierda
    const watermarkWidth = 100; // Ancho de la marca de agua en el PDF
    const watermarkHeight = 40; // Altura de la marca de agua en el PDF
    const watermarkX = 10; // Coordenada X de la marca de agua
    const watermarkY = 10; // Coordenada Y de la marca de agua
    doc.addImage(logo, 'PNG', watermarkX, watermarkY, watermarkWidth, watermarkHeight, null, 'FAST');

    // Agregar título centrado y en negrita (title)
    const title = getTitle();
    const titleFontSize = 12;
    const titleWidth = doc.getStringUnitWidth(title) * titleFontSize / doc.internal.scaleFactor;
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
    const titleY = watermarkY + watermarkHeight + 10; // Ajusta la posición vertical según tus necesidades
    doc.setFontSize(titleFontSize);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(title, titleX, titleY);

    // Agregar título centrado y en negrita (getTitulo)
    const titulo = getTitulo();
    const tituloFontSize = 8;
    const tituloWidth = doc.getStringUnitWidth(titulo) * tituloFontSize / doc.internal.scaleFactor;
    const tituloX = (doc.internal.pageSize.width - tituloWidth) / 2;
    const tituloY = titleY + 10; // Ajusta la posición vertical según tus necesidades
    doc.setFontSize(tituloFontSize);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    doc.text(titulo, tituloX, tituloY);

    const currentDate = new Date(); // Obtener la fecha actual
    const tableData = filteredActivities.map((actividad) => {
      // Calcular la edad a partir de la fecha de nacimiento
      const birthDate = new Date(actividad.fechaNacimiento);
      const age = currentDate.getFullYear() - birthDate.getFullYear();
    
      // Formatear la edad como número
      const formattedAge = Number.isNaN(age) ? '' : age.toString();
    
      return [
        actividad.idActividad,
        (actividad.idCliente ? `${actividad.nameClient} ${actividad.apellidoClient}` : `${actividad.nameClient} ${actividad.apellidoClient}`),
        actividad.dpi,
        actividad.telefono,
        actividad.genero,
        formattedAge, // Aquí mostramos la edad en lugar de la fecha de nacimiento
        actividad.estadoCivil,
        actividad.ocupacion,
        actividad.trabajando
      ];
    });     

    doc.autoTable({
      head: [['Código de la familia', 'Nombre completo del representante de la familia', 'Número de DPI', 'Teléfono', 'Género (F, M)', 'Edad (años)', 'Estado civil (S, C, U, D, otro)', 'Ocupación', 'Trabaja actualmente (Si, No)']],
      body: tableData,
      startY: tituloY + 5,
      theme: 'grid', // Usar el estilo de tabla grid
      styles: {
        font: 'helvetica', // Cambiar a fuente helvetica
        fontSize: 10,
        cellPadding: 5, // Espacio interno de la celda
        halign: 'center', // Alineación horizontal de contenido
        lineColor: [0, 0, 0], // Color de los bordes de las celdas (negro)
        lineWidth: 0.2, // Ancho de los bordes de las celdas (ajusta según tus preferencias)
      },
      headStyles: {
        fontSize: 10,
        fillColor: [51, 153, 102], // Color de fondo del encabezado (verde)
        textColor: [255, 255, 255], // Color de texto del encabezado (blanco)
        halign: 'center', // Alineación horizontal del texto en el encabezado
        valign: 'middle', // Alineación vertical del texto en el encabezado
      },
      didDrawCell: (data) => {
        if (data.column.index === 0) {
          // Comprueba si es la primera columna (Código de la familia)
          data.cell.styles.fillColor = [255, 255, 0]; // Cambia el fondo de la celda a amarillo
        }
      },
      tableLineColor: [0, 0, 0], // Color de los bordes de la tabla (negro)
      tableLineWidth: 0.2, // Ancho de los bordes de la tabla (ajusta según tus preferencias)
      margin: { top: 80 }, // Ajusta el margen superior para evitar superponerse con la tabla
    });    

    doc.save('reporte_actividades.pdf');
    setModalOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setModalOpen(true)}>
        Generar PDF
      </Button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Paper sx={{ p: 2, width: 400, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <h6 style={{ margin: '0', marginRight: '8px' }}>Fecha Inicio</h6>
            <TextField
              type="date"
              value={newEvent.fechaInicio}
              onChange={(e) => setNewEvent({ ...newEvent, fechaInicio: e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <h6 style={{ margin: '0', marginRight: '8px' }}>Fecha Final</h6>
            <TextField
              type="date"
              value={newEvent.fechaFinal}
              onChange={(e) => setNewEvent({ ...newEvent, fechaFinal: e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
          </div>
          <RadioGroup
            aria-label="Filtro Estado"
            name="filtroEstado"
            value={newEvent.filtroEstado}
            onChange={(e) => setNewEvent({ ...newEvent, filtroEstado: e.target.value })}
            row
            sx={{ marginBottom: 2 }}
          >
            <FormControlLabel value="todos" control={<Radio />} label="Todos" />
            <FormControlLabel value="Completa" control={<Radio />} label="Completa" />
            <FormControlLabel value="Pendiente" control={<Radio />} label="Pendiente" />
          </RadioGroup>
          <Button variant="contained" color="primary" onClick={handleGeneratePDF}>
            Generar PDF
          </Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default ReportePDF;
