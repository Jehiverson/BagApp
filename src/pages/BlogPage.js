import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Button, Container, Stack, Typography, TextField } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment'; // Cambia la importación de moment
import 'moment/locale/es'; // Importa el idioma si lo deseas
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';

import Iconify from '../components/iconify';

export default function BlogPage() {
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isNewEventModalOpen, setNewEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: ''
  });
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/bagapp-react/us-central1/app/api/actividades');
      const filteredEvents = response.data.map(event => ({
        title: event.nombreActividad,
        start: moment(event.fechaInicio), // Sin .utc() aquí, para que se interprete en la zona horaria local
        end: moment(event.fechaFinal), // Sin .utc() aquí, para que se interprete en la zona horaria local
      }));
      setEvents(filteredEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const createEvent = async () => {
    try {
      const localStart = moment(newEvent.fechaInicio).tz('UTC').format('YYYY-MM-DD'); // Convertir a UTC y quitar la hora
      const localEnd = moment(newEvent.fechaFinal).tz('UTC').format('YYYY-MM-DD'); // Convertir a UTC y quitar la hora
  
      await axios.post('http://localhost:5000/bagapp-react/us-central1/app/api/actividades', {
        ...newEvent,
        fechaInicio: localStart,
        fechaFinal: localEnd
      });
  
      fetchEvents();
      closeNewEventModal();
      setNewEvent({
        nombreActividad: '',
        descripcionActividad: '',
        fechaEntrega: '',
        estadoActividad: '',
        fechaInicio: '',
        fechaFinal: ''
      });
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };  

  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`backend_endpoint/events/${eventId}`);
      fetchEvents();
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const updateEvent = async (updatedEvent) => {
    try {
      await axios.put(`backend_endpoint/events/${updatedEvent.id}`, updatedEvent);
      fetchEvents();
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const openNewEventModal = () => {
    setNewEventModalOpen(true);
  };

  const closeNewEventModal = () => {
    setNewEventModalOpen(false);
  };

  const selectEvent = (event) => {
    setSelectedEvent(event);
  };

  const customEventStyleGetter = (event) => ({
      style: {
        backgroundColor: 'blue',
      },
    });

  return (
    <>
      <Helmet>
        <title>Actividades</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Actividades
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={openNewEventModal}>
            Nueva Actividad
          </Button>
        </Stack>

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={selectEvent}
          eventPropGetter={customEventStyleGetter}
        />

        <Modal
          isOpen={isNewEventModalOpen}
          onRequestClose={closeNewEventModal}
          style={{
            overlay: {
              zIndex: 1000,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            content: {
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '8px',
              padding: '20px',
              maxWidth: '600px',
              margin: 'auto',
            },
          }}
        >
          {/* Contenido del modal */}
          <div>
            <TextField
              type="text"
              label="Nombre"
              value={newEvent.nombreActividad}
              onChange={(e) => setNewEvent({ ...newEvent, nombreActividad: e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              type="text"
              label="Descripción"
              value={newEvent.descripcionActividad}
              onChange={(e) => setNewEvent({ ...newEvent, descripcionActividad: e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              type="date"
              label="Fecha Entrega"
              value={newEvent.fechaEntrega}
              onChange={(e) => setNewEvent({ ...newEvent, fechaEntrega: e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              type="text"
              label="Estado"
              value={newEvent.estadoActividad}
              onChange={(e) => setNewEvent({ ...newEvent, estadoActividad: e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <h6 style={{ margin: '0', marginRight: '8px' }}>Fecha Inicio</h6>
              <TextField
                type="date"
                value={newEvent.fechaInicio}
                onChange={(e) => setNewEvent({ ...newEvent, fechaInicio: e.target.value })}
                fullWidth
                sx={{ marginBottom: 0 }}
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
          </div>
          {/* Botones */}
          <Button onClick={createEvent} variant="contained" color="primary" sx={{ marginRight: 2 }}>
            Crear Evento
          </Button>
          <Button onClick={closeNewEventModal} variant="contained">
            Cancelar
          </Button>
        </Modal>

        {selectedEvent && (
          <Modal 
          isOpen onRequestClose={() => setSelectedEvent(null)}
          style={{
            overlay: {
              zIndex: 1000, // Asegúrate de que el valor de zIndex sea lo suficientemente alto
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
            },
            content: {
              top: '50%', // Posición vertical centrada
              left: '50%', // Posición horizontal centrada
              transform: 'translate(-50%, -50%)', // Centrar el modal
              borderRadius: '8px', // Bordes redondeados
              padding: '20px', // Espacio interno
              maxWidth: '600px', // Ancho máximo del modal
              margin: 'auto', // Centrar horizontalmente si el ancho del modal es menor que maxWidth
            },
          }}
          >
            <h2>{selectedEvent.title}</h2>
            {/* Muestra los otros campos según tus necesidades */}
            <Button onClick={() => deleteEvent(selectedEvent.id)}>Eliminar Evento</Button>
            <Button onClick={() => updateEvent(selectedEvent)}>Actualizar Evento</Button>
          </Modal>
        )}
      </Container>
    </>
  );
}
