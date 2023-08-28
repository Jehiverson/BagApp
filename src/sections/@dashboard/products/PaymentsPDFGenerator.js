import React, { useState } from 'react';
import { Button, Modal, Paper, TextField } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PaymentsPDFGenerator = ({ pagoData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    fechaInicio: '',
    fechaFinal: '',
  });

  const handleGeneratePDF = () => {
    const { fechaInicio, fechaFinal } = newEvent;

    const filteredPayments = pagoData.filter(
      (pago) =>
        new Date(pago.fechaPago) >= new Date(fechaInicio) &&
        new Date(pago.fechaPago) <= new Date(fechaFinal)
    );

    const doc = new jsPDF();
    doc.text('Pagos filtrados por fechas', 10, 10);
    
    const tableData = filteredPayments.map((pago) => [
      pago.idPago,
      pago.idCliente,
      pago.nombre,
      pago.apellido,
      pago.fechaPago,
      pago.monto,
      pago.idActividad,
      pago.noVoucher,
      pago.tipoPago,
      pago.nit,
      pago.descripcion,
    ]);

    doc.autoTable({
      head: [['N°', 'Cliente', 'Nombre', 'Apellido', 'Fecha', 'Monto', 'N° Actividad', 'Voucher', 'Tipo', 'NIT', 'Descripcion']],
      body: tableData,
    });

    doc.save('pagos_filtrados.pdf');
    setModalOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setModalOpen(true)}>
        Generar PDF
      </Button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Paper sx={{ p: 2, width: 400 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <h6 style={{ margin: '0', marginRight: '8px' }}>Fecha Inicio</h6>
            <TextField
              type="date"
              value={newEvent.fechaInicio}
              onChange={(e) => setNewEvent({ ...newEvent, fechaInicio: e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
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
          <Button variant="contained" color="primary" onClick={handleGeneratePDF}>
            Generar PDF
          </Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default PaymentsPDFGenerator;
