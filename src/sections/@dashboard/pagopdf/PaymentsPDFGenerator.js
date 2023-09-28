import React, { useState } from 'react';
import { Button, Modal, Paper, TextField, Radio, RadioGroup, FormControlLabel, Select, MenuItem } from '@mui/material';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format, parseISO, isSameMonth } from 'date-fns'; // Importa parseISO desde date-fns
import { es } from 'date-fns/locale';

// Componente PaymentsPDFGenerator
const PaymentsPDFGenerator = ({ pagoData }) => {
  // Estado para controlar la apertura y cierre del modal
  const [modalOpen, setModalOpen] = useState(false);

  // Obtener el objeto de usuario desde el almacenamiento local
  const localStorageUser = JSON.parse(localStorage.getItem('user'));

  // Extraer el valor de 'tipoRol' del objeto de usuario
  const username = localStorageUser ? localStorageUser.username : null;

  // Estado para gestionar la selección de actividades
  const [selectedActividades, setSelectedActividades] = useState([]);

  // Estado para gestionar las fechas y el tipo de filtro
  const [newEvent, setNewEvent] = useState({
    fechaInicio: '',
    fechaFinal: '',
    filtroTipo: 'todos', // Opciones: 'todos', 'voucher', 'efectivo'
  });

  // Función para obtener el título del documento PDF
  const getTitle = (filtroTipo) => {
    if (filtroTipo === 'voucher') return 'Pagos con Voucher';
    if (filtroTipo === 'efectivo') return 'Pagos hechos en Efectivo';
    return 'Pagos Realizados';
  };

  // Función para generar el PDF de pagos filtrados
  const handleGeneratePDF = () => {
    const { fechaInicio, fechaFinal, filtroTipo } = newEvent;

    // Copiar la lista de pagos para aplicar filtros sin modificar la lista original
    let filteredPayments = [...pagoData];

    // Aplicar filtro por tipo de pago (voucher o efectivo)
    if (filtroTipo === 'voucher') {
      filteredPayments = filteredPayments.filter((pago) => pago.tipoPago === 'voucher');
    } else if (filtroTipo === 'efectivo') {
      filteredPayments = filteredPayments.filter((pago) => pago.tipoPago === 'efectivo');
    }

    // Aplicar filtro por idActividad (nuevo filtro)
    if (selectedActividades.length > 0) {
      filteredPayments = filteredPayments.filter((pago) => selectedActividades.includes(pago.idActividad));
    }

    // Parsear las fechas de inicio y fin
    const startDate = parseISO(`${fechaInicio}T00:00:00.000-06:00`);
    const endDate = parseISO(`${fechaFinal}T23:59:59Z`);

    // Generar texto para rango de fechas
    const dateRangeText = `Desde ${format(startDate, 'dd/MM/yyyy')} hasta ${format(endDate, 'dd/MM/yyyy')}`;
    const monthRangeText = generateDateRangeText(startDate, endDate);

    // Filtrar los pagos por fecha
    filteredPayments = filteredPayments.filter(
      (pago) => parseISO(pago.fechaPago) >= startDate && parseISO(pago.fechaPago) <= endDate
    );

    // Crear un nuevo objeto PDF
    const doc = new jsPDF();

    // Agregar marca de agua
    doc.setFontSize(12);
    doc.setTextColor(200);
    doc.text('KingoEnergy', doc.internal.pageSize.width - 10, 10, 'right');

    // Agregar título
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(getTitle(filtroTipo), 10, 20);

    // Agregar rango de fechas
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(dateRangeText, 10, 30);
    doc.text(monthRangeText, 10, 40);

    // Agregar Nombre y Apellido
    const nameAndLastName = `Nombre: ${username}`;
    doc.text(nameAndLastName, 10, 50);

    // Crear datos de la tabla
    const tableData = filteredPayments.map((pago) => [
      pago.idPago,
      pago.idCliente !== null ? `${pago.idCliente} - ${pago.nombre} ${pago.apellido}` : `${pago.nombre} ${pago.apellido}`,
      format(new Date(pago.fechaPago), 'yyyy-MM-dd HH:mm:ss', { timeZone: 'America/Guatemala' }),
      pago.monto,
      pago.actividad.nombreActividad,
      pago.noVoucher,
      pago.tipoPago,
      pago.nit,
      pago.descripcion,
    ]);

    // Agregar tabla al documento PDF
    doc.autoTable({
      head: [['N°', 'Cliente', 'Fecha', 'Monto', 'Actividad', 'Voucher', 'Tipo', 'NIT', 'Descripcion']],
      body: tableData,
      startY: 60,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 10,
        textColor: [0, 0, 0],
      },
      headStyles: {
        fontSize: 10,
        fillColor: [51, 153, 102],
        textColor: [255, 255, 255],
        halign: 'center',
        valign: 'middle',
      },
    });

    // Agregar Firma y Empresa
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Firma: ______________________', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 30, 'center');
    doc.text('Empresa Kingo Energy', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 20, 'center');

    // Guardar el PDF con un nombre específico
    doc.save('pagos_filtrados.pdf');
    setModalOpen(false); // Cerrar el modal después de generar el PDF
  };

  // Función para generar el texto del rango de fechas en español
  const generateDateRangeText = (startDate, endDate) => {
    const startMonth = format(startDate, 'MMMM', { locale: es });
    const endMonth = format(endDate, 'MMMM', { locale: es });

    if (isSameMonth(startDate, endDate)) {
      return `Mes ${startMonth}`;
    }

    return `Mes de ${startMonth} y ${endMonth}`;
  };

  // Filtrar y obtener opciones únicas de actividades
  const uniqueActivities = pagoData.reduce((acc, pago) => {
    const existingActividad = acc.find((item) => item.idActividad === pago.idActividad);

    if (!existingActividad) {
      acc.push({ idActividad: pago.idActividad, nombreActividad: pago.actividad.nombreActividad });
    }

    return acc;
  }, []);

  return (
    <div>
      {/* Botón para abrir el modal */}
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setModalOpen(true)}>
        Generar PDF
      </Button>

      {/* Modal para seleccionar las fechas y opciones de filtro */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Paper sx={{ p: 2, width: 400, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          {/* Campo de fecha de inicio */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <h6 style={{ margin: '0', marginRight: '8px' }}>Fecha Inicio</h6>
            <TextField
              type="date"
              value={newEvent.fechaInicio}
              onChange={(e) => setNewEvent({ ...newEvent, fechaInicio: e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
              InputLabelProps={{
                shrink: true, // Mantiene la etiqueta visible incluso después de seleccionar la fecha
              }}
            />
          </div>

          {/* Campo de fecha final */}
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

          {/* Grupo de opciones de filtro */}
          <RadioGroup
            aria-label="Filtro Tipo"
            name="filtroTipo"
            value={newEvent.filtroTipo}
            onChange={(e) => setNewEvent({ ...newEvent, filtroTipo: e.target.value })}
            row
            sx={{ marginBottom: 2 }}
          >
            <FormControlLabel value="todos" control={<Radio />} label="Todos" />
            <FormControlLabel value="voucher" control={<Radio />} label="Voucher" />
            <FormControlLabel value="efectivo" control={<Radio />} label="Efectivo" />
          </RadioGroup>

          {/* Selector de actividades */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <h6 style={{ margin: '0', marginRight: '8px' }}>Seleccionar Actividad</h6>
            <Select
              multiple // Permitir selección múltiple
              value={selectedActividades}
              onChange={(e) => setSelectedActividades(e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value="">Todas las actividades</MenuItem>
              {/* Iterar sobre las opciones únicas de actividades */}
              {uniqueActivities.map((actividad) => (
                <MenuItem key={actividad.idActividad} value={actividad.idActividad}>
                  {`${actividad.idActividad} - ${actividad.nombreActividad}`}
                </MenuItem>
              ))}
            </Select>
          </div>

          {/* Botón para generar el PDF */}
          <Button variant="contained" color="primary" onClick={handleGeneratePDF} startIcon={<CloudDownloadOutlinedIcon />}>
            Generar PDF
          </Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default PaymentsPDFGenerator;
