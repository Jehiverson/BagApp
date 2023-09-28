// Importación de bibliotecas y componentes con enlaces a la documentación
import { useForm } from 'react-hook-form'; // Importación de react-hook-form para la gestión de formularios. Documentación: https://react-hook-form.com/
import React from 'react';
import { TextField, Button, Typography } from '@mui/material'; // Importación de componentes de Material-UI. Documentación: https://mui.com/components/text-fields/
import moment from 'moment'; // Importación de moment para el manejo de fechas. Documentación: https://momentjs.com/
import { toast } from 'react-toastify'; // Importación de react-toastify para notificaciones. Documentación: https://github.com/fkhadra/react-toastify
import SendIcon from '@mui/icons-material/Send';

import 'react-toastify/dist/ReactToastify.css'; // Estilos para react-toastify
import { actividadDatos } from '../../api/actividadApi'; // Importación de funciones personalizadas para la API de actividades.

export const FormIngresarActividad = ({ closeNewEventModal, fetchEvents }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = handleSubmit(async (values) => {
    try {
      // Incrementar un día a las fechas antes de enviarlas
      const formattedEvent = {
        ...values,
        fechaEntrega: moment(values.fechaEntrega).add(1, 'day').format('YYYY-MM-DD'),
        fechaInicio: moment(values.fechaInicio).add(1, 'day').format('YYYY-MM-DD'),
        fechaFinal: moment(values.fechaFinal).add(1, 'day').format('YYYY-MM-DD'),
      };

      await actividadDatos(formattedEvent);
      toast.success('Actividad Creada'); // Muestra una notificación de éxito
      // Restablecer los valores del formulario y el estado
      reset({
        nombreActividad: '',
        descripcionActividad: '',
        fechaEntrega: '',
        fechaInicio: '',
        fechaFinal: '',
        estadoActividad: 'Pendiente'
      });
      closeNewEventModal();
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Error al crear la actividad'); // Muestra una notificación de error
    }
  });

  return (
    <>
      {/* Formulario */}
      <form onSubmit={onSubmit}>
        <div style={{ display: 'flex', marginTop: 15, marginLeft: 15 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField type='text' {...register("nombreActividad", {
              required: "Este campo es obligatorio",
              minLength: {
                value: 3,
                message: "El Nombre debe tener al menos 3 letras",
              },
              pattern: {
                value: /^[A-Za-z]+$/,
                message: "El Nombre solo puede contener letras",
              },
            })} placeholder='Nombre de Actividad' style={{ marginRight: 15, width: 300 }} />
            {errors.nombreActividad && (
              <Typography variant="caption" color="error">
                {errors.nombreActividad.message}
              </Typography>
            )}
          </div>
          <TextField type='text' {...register("descripcionActividad")} placeholder='Descripción de Actividad' multiline style={{ width: 300 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 15, marginLeft: 15 }}>
          <Typography variant='h6'>Fecha de Entrega</Typography>
          <TextField type='date' {...register("fechaEntrega", {
            required: 'La Fecha de Entrega es obligatoria',
          })} style={{ width: 620 }} />
          {errors.fechaEntrega && (
            <Typography variant='caption' color='error'>
              {errors.fechaEntrega.message}
            </Typography>
          )}
        </div>
        <div style={{ display: 'flex', marginTop: 15, marginLeft: 15 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h6'>Fecha de Inicio</Typography>
            <TextField type='date' {...register("fechaInicio", {
              required: 'La Fecha de Inicio es obligatoria',
            })} style={{ marginRight: 15, width: 304 }} />
            {errors.fechaInicio && (
              <Typography variant='caption' color='error'>
                {errors.fechaInicio.message}
              </Typography>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h6'>Fecha de Finalización</Typography>
            <TextField type='date' {...register("fechaFinal", {
              required: 'La Fecha de Finalización es obligatoria',
            })} style={{ width: 304 }} />
            {errors.fechaFinal && (
              <Typography variant='caption' color='error'>
                {errors.fechaFinal.message}
              </Typography>
            )}
          </div>
        </div>
        <div style={{ marginTop: 15, marginLeft: 15 }}>
          <TextField type='text' {...register("estadoActividad")} defaultValue="Pendiente" style={{ width: 620 }} />
        </div>
        <div style={{ display: 'flex', marginTop: 15, marginLeft: 15 }}>
          <TextField type='number' {...register("precioActividad")} placeholder='Precio de Actividad' style={{ marginRight: 15, width: 305 }} />
          <TextField type='text' {...register("lugarActividad")} placeholder='Lugar de la Actividad' style={{ marginRight: 15, width: 305 }} />
        </div>
        <div style={{ marginTop: 15, marginLeft: 15 }}>
          <Button type='submit' variant="contained" startIcon={<SendIcon />}>Enviar</Button>
        </div>
      </form>
    </>
  );
};
