import { TextField, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import SendIcon from '@mui/icons-material/Send';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { actualizarActividad } from '../../api/actividadApi';

export const FormActualizarEvento = ({ selectedEvent, setSelectedEvent, fetchEvents }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [datosCargados, setDatosCargados] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    values.fechaInicio = moment(values.fechaInicio).add(1, 'day').format('YYYY-MM-DD');
    values.fechaEntrega = moment(values.fechaEntrega).add(1, 'day').format('YYYY-MM-DD');
    values.fechaFinal = moment(values.fechaFinal).add(1, 'day').format('YYYY-MM-DD');
    const idActividad = selectedEvent.idActividad;
    try {
      await actualizarActividad(idActividad, values);
      toast.success("Se actualizó la actividad correctamente");
      setSelectedEvent(null);
      fetchEvents();
    } catch (error) {
      toast.error("Error al actualizar la actividad");
      console.log({ message: "No se pudo actualizar", error });
    }
  });

  useEffect(() => {
    if (!datosCargados) {
      console.log("selectedEvent:", selectedEvent);
      setValue("nombreActividad", selectedEvent.title);
      setValue("descripcionActividad", selectedEvent.descripcionActividad);
      setValue("fechaEntrega", moment(selectedEvent.fechaEntrega).format('YYYY-MM-DD'));
      setValue("fechaInicio", moment(selectedEvent.fechaInicio).format('YYYY-MM-DD'));
      setValue("fechaFinal", moment(selectedEvent.fechaFinal).format('YYYY-MM-DD'));

    }
  }, [selectedEvent, datosCargados, setValue]);

  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginRight: '1rem' }}>
          <div style={{ display: 'flex' }}>
            <TextField type='text' {...register("nombreActividad")} placeholder='Nombre de Actividad' style={{ marginRight: 15 }} />
            <TextField type='text' {...register("descripcionActividad")} placeholder='Descripcion de Actividad' />
          </div>
        </div>
        <div style={{ marginTop: 15 }}>
          <Typography variant='h6'>Fecha de Entrega</Typography>
          <TextField type='date' {...register("fechaEntrega")} />
        </div>
        <div style={{ display: 'flex', marginTop: 15 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h6'>Fecha de Inicio</Typography>
            <TextField type='date' {...register("fechaInicio")} style={{ marginRight: 15 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h6'>Fecha de Final</Typography>
            <TextField type='date' {...register("fechaFinal")} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <Button type="submit" variant="contained" endIcon={<SendIcon />}>
          Enviar
        </Button>
      </div>
    </form>
  );
};
