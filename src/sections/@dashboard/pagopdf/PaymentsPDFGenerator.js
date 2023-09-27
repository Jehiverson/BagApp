import React, { useState } from 'react';
import { Button, Modal, Paper, TextField, Radio, RadioGroup, FormControlLabel, Select, MenuItem } from '@mui/material';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format, parseISO, isSameMonth } from 'date-fns'; // Importa parseISO desde date-fns
import { es } from 'date-fns/locale';

const PaymentsPDFGenerator = ({ pagoData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  // Obtener el objeto de usuario desde localStorage
  const localStorageUser = JSON.parse(localStorage.getItem('user'));
  // Extraer el valor de 'tipoRol' del objeto de usuario
  const username = localStorageUser ? localStorageUser.username : null;
  const [selectedActividades, setSelectedActividades] = useState([]);
  const [newEvent, setNewEvent] = useState({
    fechaInicio: '',
    fechaFinal: '',
    filtroTipo: 'todos', // Opciones: 'todos', 'voucher', 'efectivo'
  });

  const getTitle = (filtroTipo) => {
    if (filtroTipo === 'voucher') return 'Pagos con Voucher';
    if (filtroTipo === 'efectivo') return 'Pagos hechos en Efectivo';
    return 'Pagos Realizados';
  };

  const handleGeneratePDF = () => {
    const { fechaInicio, fechaFinal, filtroTipo } = newEvent;

    let filteredPayments = [...pagoData];

    if (filtroTipo === 'voucher') {
      filteredPayments = filteredPayments.filter((pago) => pago.tipoPago === 'voucher');
    } else if (filtroTipo === 'efectivo') {
      filteredPayments = filteredPayments.filter((pago) => pago.tipoPago === 'efectivo');
    }

    // Aplica el filtro por idActividad (nuevo filtro)
    if (selectedActividades.length > 0) {
      filteredPayments = filteredPayments.filter((pago) => selectedActividades.includes(pago.idActividad));
    }

    const startDate = parseISO(`${fechaInicio}T00:00:00.000-06:00`);  // Parsea la fecha a un objeto Date
    const endDate = parseISO(`${fechaFinal}T23:59:59Z`); // Parsea la fecha a un objeto Date
    const dateRangeText = `Desde ${format(startDate, 'dd/MM/yyyy')} hasta ${format(endDate, 'dd/MM/yyyy')}`;
    const monthRangeText = generateDateRangeText(startDate, endDate);

    filteredPayments = filteredPayments.filter(
      (pago) => parseISO(pago.fechaPago) >= startDate && parseISO(pago.fechaPago) <= endDate
    );

    const doc = new jsPDF();

    // Agregar marca de agua
    doc.setFontSize(12);
    doc.setTextColor(200);
    doc.text('KingoEnergy', doc.internal.pageSize.width - 10, 10, 'right');

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(getTitle(filtroTipo), 10, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(dateRangeText, 10, 30);
    doc.text(monthRangeText, 10, 40);

    // Agregar Nombre y Apellido
    const nameAndLastName = `Nombre: ${username}`;
    doc.text(nameAndLastName, 10, 50);

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

    doc.autoTable({
      head: [['N°', 'Cliente', 'Fecha', 'Monto', 'Actividad','Voucher', 'Tipo', 'NIT', 'Descripcion']],
      body: tableData,
      startY: 60,
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
    doc.text('Firma: ______________________', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 30, 'center');
    doc.text('Empresa Kingo Energy', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 20, 'center');

    doc.save('pagos_filtrados.pdf');
    setModalOpen(false);
  };

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
    // Verificar si ya existe un objeto con el mismo idActividad
    const existingActividad = acc.find((item) => item.idActividad === pago.idActividad);

    if (!existingActividad) {
      // Si no existe, agregarlo a la lista única con ambas propiedades
      acc.push({ idActividad: pago.idActividad, nombreActividad: pago.actividad.nombreActividad });
    }

    return acc;
  }, []);

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
                shrink: true, // Mantiene la etiqueta visible incluso después de seleccionar la fecha
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
              {/* Itera sobre las opciones únicas de actividades */}
              {uniqueActivities.map((actividad) => (
                <MenuItem key={actividad.idActividad} value={actividad.idActividad}>
                  {`${actividad.idActividad} - ${actividad.nombreActividad}`}
                </MenuItem>
              ))}
            </Select>
          </div>
          <Button variant="contained" color="primary" onClick={handleGeneratePDF} startIcon={<CloudDownloadOutlinedIcon />}>
            Generar PDF
          </Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default PaymentsPDFGenerator;
