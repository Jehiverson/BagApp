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
  const getParrafo = () => {
    const parrafo = [
      'Nombre de la Organización:________________________ |            |     |',
      'Lugar de entrega:______________manz 21 lote 8 sec, 2 Tierra Nueva 1',
      'Responsabilidad del Proyecto:___________'
    ];
    return parrafo.join(' ');
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

    const doc = new jsPDF();

    // Agregar imagen como marca de agua en la esquina superior izquierda
    const watermarkWidth = 80; // Ancho de la marca de agua en el PDF
    const watermarkHeight = 40; // Altura de la marca de agua en el PDF
    const watermarkX = 10; // Coordenada X de la marca de agua
    const watermarkY = 10; // Coordenada Y de la marca de agua
    doc.addImage(logo, 'PNG', watermarkX, watermarkY, watermarkWidth, watermarkHeight, null, 'FAST');

    // Agregar título centrado y en negrita
    const title = getTitle();
    const titleFontSize = 14; // Tamaño de fuente reducido
    const titleWidth = doc.getStringUnitWidth(title) * titleFontSize / doc.internal.scaleFactor;
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
    const titleY = watermarkY + watermarkHeight + 10;
    doc.setFontSize(titleFontSize);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(title, titleX, titleY);

    // Dibujar un rectángulo alrededor del párrafo
    const parrafo = getParrafo();
    const parrafoFontSize = 6;
    const parrafoWidth = doc.getStringUnitWidth(parrafo) * parrafoFontSize / doc.internal.scaleFactor;
    const parrafoHeight = 10; // Altura del rectángulo
    const parrafoX = watermarkX; // Misma coordenada X que la marca de agua
    const parrafoY = titleY + titleWidth + 5; // Ajustar posición vertical (movido hacia arriba)
    doc.setDrawColor(0); // Color del borde del rectángulo
    doc.rect(parrafoX, parrafoY, parrafoWidth, parrafoHeight); // Dibujar el rectángulo
    doc.setFontSize(parrafoFontSize);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    doc.text(parrafo, parrafoX + 2, parrafoY + 8);

    const tableData = filteredActivities.map((actividad) => [
      actividad.idActividad,
      actividad.nombreActividad,
      actividad.descripcionActividad,
      format(new Date(actividad.fechaEntrega), 'yyyy-MM-dd', { timeZone: 'America/Guatemala' }),
      actividad.estadoActividad,
      format(new Date(actividad.fechaInicio), 'yyyy-MM-dd', { timeZone: 'America/Guatemala' }),
      format(new Date(actividad.fechaFinal), 'yyyy-MM-dd', { timeZone: 'America/Guatemala' }),
      actividad.nameClient,
      actividad.idPago
    ]);

    doc.autoTable({
      head: [['N°', 'Nombre', 'Descripcion', 'Entrega', 'Estado', 'Inicio', 'Finaliza', 'Cliente', 'Pago']],
      body: tableData,
      startY: 80,
      theme: 'grid', // Usar el estilo de tabla grid
      styles: {
        font: 'helvetica', // Cambiar a fuente helvetica
        fontSize: 10,
        textColor: [0, 0, 0],
      },
      headStyles: {
        fontSize: 10,
        fillColor: [51, 153, 102], // Color de fondo del encabezado (verde)
        textColor: [255, 255, 255], // Color de texto del encabezado (blanco)
        halign: 'center', // Alineación horizontal del texto en el encabezado
        valign: 'middle', // Alineación vertical del texto en el encabezado
      },
    });

    // Agregar Firma y Empresa
    doc.setFontSize(12);
    doc.setTextColor(0);

    // Ajustar coordenadas para que la firma y la empresa aparezcan en la parte inferior
    doc.text('Firma: ______________________', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 60, 'center');
    doc.text('Empresa Kingo Energy', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 50, 'center');

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
