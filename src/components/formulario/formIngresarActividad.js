import { useForm } from 'react-hook-form';
import React from 'react';
import { TextField, Button, Typography } from '@mui/material';
import moment from 'moment';
import { toast } from 'react-toastify';
import SendIcon from '@mui/icons-material/Send';
import 'react-toastify/dist/ReactToastify.css';
import { actividadDatos } from '../../api/actividadApi';

export const FormIngresarActividad = ({closeNewEventModal, fetchEvents}) => {
  const { register, handleSubmit, formState: { errors },reset } = useForm();

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
      toast.success('Actividad Creada');
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
      toast.error('Error al crear la actividad');
    }
  });

  return (
    <>
      {/* Aquí debes completar tu formulario */}
      <form onSubmit={onSubmit}>
        <div style={{ display: 'flex', marginTop: 15, marginLeft: 15 }}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
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
          <TextField type='text' {...register("descripcionActividad")} placeholder='Descripcion de Actividad' multiline style={{width: 300}} />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', marginTop: 15, marginLeft: 15}}>
          <Typography variant='h6'>Fecha de Entrega</Typography>
          <TextField type='date' {...register("fechaEntrega", {
            required: 'La Fecha de Inicio es obligatoria',
          })} style={{width: 620}} />
          {errors.fechaEntrega && (
              <Typography variant='caption' color='error'>
                {errors.fechaEntrega.message}
              </Typography>
            )}
        </div>
        <div style={{display: 'flex', marginTop: 15, marginLeft: 15}}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <Typography variant='h6'>Fecha de Inicio</Typography>
            <TextField type='date' {...register("fechaInicio", {
              required: 'La Fecha de Inicio es obligatoria',
            })} style={{marginRight: 15, width: 304}} />
            {errors.fechaInicio && (
              <Typography variant='caption' color='error'>
                {errors.fechaInicio.message}
              </Typography>
            )}
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <Typography variant='h6'>Fecha de Final</Typography>
            <TextField type='date' {...register("fechaFinal", {
              required: 'La Fecha de Inicio es obligatoria',
            })} style={{width: 304}} />
            {errors.fechaFinal && (
              <Typography variant='caption' color='error'>
                {errors.fechaFinal.message}
              </Typography>
            )}
          </div>
        </div>
        <div style={{marginTop: 15, marginLeft: 15}}>
          <TextField type='text' {...register("estadoActividad")} defaultValue="Pendiente" style={{width: 620}} />
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
