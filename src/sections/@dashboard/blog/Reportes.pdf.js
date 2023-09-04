import React, { useState } from 'react';
import { Button, Modal, Paper, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { parseISO } from 'date-fns';
import logo from './pdf/logo_pdf.png';

/*
function calcularEdad(fechaNacimiento, fechaHijo) {
  const diff = fechaHijo - fechaNacimiento;
  const edad = new Date(diff);
  return Math.abs(edad.getUTCFullYear() - 1970);
} */
// Función para calcular la edad en años a partir del número de años
function calcularEdad(edadHijo) {
  return parseInt(edadHijo, 10);
}


const ReportePDF = ({ dataReporte }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    fechaInicio: '',
    fechaFinal: '',
    filtroEstado: 'todos',
  });

  const getTitle = () => 'BANCO DE ALIMENTOS DE GUATEMALA - BASE DE DATOS DE BENEFICIARIOS';
  const getTitulo = () => {
    const nombreOrganizacion = 'Nombre de la Organización:____________';
    const lugarEntrega = 'Lugar de entrega:________________manz 21 lote 8 sec, 2 Tierra Nueva 1';
    const responsabilidadProyecto = 'Responsabilidad del Proyecto:_________';

    return `${nombreOrganizacion}          Fecha entrega:          ${lugarEntrega}          ${responsabilidadProyecto}`;
  };

  const handleGeneratePDF = () => {
    try {
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

      // Add watermark
      const watermarkWidth = 100;
      const watermarkHeight = 40;
      const watermarkX = 10;
      const watermarkY = 10;
      doc.addImage(logo, 'PNG', watermarkX, watermarkY, watermarkWidth, watermarkHeight, null, 'FAST');

      // Calculate the center position for titles
      const centerX = doc.internal.pageSize.width / 2;

      // Add title centered and in bold
      const title = getTitle();
      const titleFontSize = 12;
      doc.setFontSize(titleFontSize);
      doc.setTextColor(0);
      doc.setFont('helvetica', 'bold');
      doc.text(centerX, watermarkY + watermarkHeight + 5, title, 'center');

      // Add subtitle centered
      const titulo = getTitulo();
      const tituloFontSize = 8;
      doc.setFontSize(tituloFontSize);
      doc.setFont('helvetica', 'normal');
      doc.text(centerX, watermarkY + watermarkHeight + 15, titulo, 'center');

      const currentDate = new Date();

      const tableHeaders = [
        [
          { content: 'CODIGO', rowSpan: 3 },
          { content: 'Nombre completo del representante de la familia\n(Nombres, Apellido)', rowSpan: 3 },
          { content: 'Numero de DPI', rowSpan: 3 },
          { content: 'Telefono', rowSpan: 3 },
          { content: 'Genero\n(F,M)', rowSpan: 3 },
          { content: 'Edad\n(años)', rowSpan: 3 },
          { content: 'Estado Civil\n(S,C,U,D,otro)', rowSpan: 3 },
          { content: 'Ocupacion', rowSpan: 3 },
          { content: 'Trabaja actualmente\n(Si,No)', rowSpan: 3 },
          { content: 'Numero de Beneficiarios', colSpan: 10 },
          { content: 'TOTAL MIEMBROS DE LA FAMILIA', rowSpan: 3 },
          { content: 'Direccion', rowSpan: 3 },
        ],
        [
          { content: '0-2 años', colSpan: 2 },
          { content: '3 a 5 años', colSpan: 2 },
          { content: '6 a 18 años', colSpan: 2 },
          { content: '19 a 49 años', colSpan: 2 },
          { content: 'Mayor 50 años', colSpan: 2 },
          '',
          '',
          '',
          '',
          '',
        ],
        [
          'H',
          'M',
          'H',
          'M',
          'H',
          'M',
          'H',
          'M',
          'H',
          'M',
          '',
          '',
          '',
          '',
        ],
      ]; 
      const tableData = filteredActivities.map((actividad) => {
        const birthDate = new Date(actividad.fechaNacimiento);
        const age = currentDate.getFullYear() - birthDate.getFullYear();
        const formattedAge = Number.isNaN(age) ? '' : age.toString();
        const genero = actividad.genero;

        // Inicializa contadores para cada categoría
        const categorias = {
          '0-2 años Hombre': 0,
          '0-2 años Mujer': 0,
          '3-5 años Hombre': 0,
          '3-5 años Mujer': 0,
          '6-18 años Hombre': 0,
          '6-18 años Mujer': 0,
          '19-49 años Hombre': 0,
          '19-49 años Mujer': 0,
          '50+ años Hombre': 0,
          '50+ años Mujer': 0,
        };
        // Verificar si actividad.hijos existe y es un array
        if (actividad.hijo && Array.isArray(actividad.hijo)) {
          actividad.hijo.forEach((hijo) => {
            const edadHijo = parseInt(hijo.edad, 10); // Convierte la edad del hijo a número
            const generoHijo = hijo.genero;

            if (edadHijo >= 0 && edadHijo <= 2) {
              categorias[`${edadHijo}-2 años ${generoHijo}`] = (categorias[`${edadHijo}-2 años ${generoHijo}`] || 0) + 1;
            } else if (edadHijo >= 3 && edadHijo <= 5) {
              categorias[`3-5 años ${generoHijo}`] = (categorias[`3-5 años ${generoHijo}`] || 0) + 1;
            } else if (edadHijo >= 6 && edadHijo <= 18) {
              categorias[`6-18 años ${generoHijo}`] = (categorias[`6-18 años ${generoHijo}`] || 0) + 1;
            } else if (edadHijo >= 19 && edadHijo <= 49) {
              categorias[`19-49 años ${generoHijo}`] = (categorias[`19-49 años ${generoHijo}`] || 0) + 1;
            } else {
              categorias[`50+ años ${generoHijo}`] = (categorias[`50+ años ${generoHijo}`] || 0) + 1;
            }
          });
        }
      
        return [
          actividad.idActividad,
          (actividad.idCliente ? `${actividad.nameClient} ${actividad.apellidoClient}` : `${actividad.nameClient} ${actividad.apellidoClient}`),
          actividad.dpi,
          actividad.telefono,
          actividad.genero,
          formattedAge,
          actividad.estadoCivil,
          actividad.ocupacion,
          actividad.trabajando,
          categorias['0-2 años Hombre'], // 0 a 2 años Hombre
          categorias['0-2 años Mujer'],  // 0 a 2 años Mujer
          categorias['3-5 años Hombre'], // 3 a 5 años Hombre
          categorias['3-5 años Mujer'],  // 3 a 5 años Mujer
          categorias['6-18 años Hombre'], // 6 a 18 años Hombre
          categorias['6-18 años Mujer'],  // 6 a 18 años Mujer
          categorias['19-49 años Hombre'], // 19 a 49 años Hombre
          categorias['19-49 años Mujer'],  // 19 a 49 años Mujer
          categorias['50+ años Hombre'],   // 50+ años Hombre
          categorias['50+ años Mujer'],    // 50+ años Mujer
          actividad.cantidadHijos, // Miembros
          actividad.direccion
        ];
      });

      const tableOptions = {
        margin: { top: watermarkY + watermarkHeight + 30 },
        styles: {
          fontSize: 6, // Cambiar el tamaño de fuente a 6
          cellPadding: 2,
        },
        theme: 'grid',
        headStyles: {
          fontSize: 6, // Cambiar el tamaño de fuente a 6
          fillColor: [51, 153, 102],
          textColor: [255, 255, 255],
          halign: 'center',
          valign: 'middle',
        },
      };

      doc.autoTable({
        head: [tableHeaders[0], tableHeaders[1], tableHeaders[2]], // Encabezado separado en filas individuales
        body: tableData,
        ...tableOptions,
      });

      // Handle pagination if needed (you may adjust this logic)
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i += 1) {
        doc.setPage(i);
        doc.text(centerX, watermarkY + watermarkHeight + 10, `Página ${i} de ${totalPages}`, 'center');
      }

      doc.save('reporte_actividades.pdf');
      setModalOpen(false);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
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
