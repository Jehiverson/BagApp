import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import moment from 'moment';
import { toast } from 'react-toastify';
import SendIcon from '@mui/icons-material/Send';
import 'react-toastify/dist/ReactToastify.css';
import { actividadDatos } from '../../api/actividadApi';
import { obtenerClientes } from '../../api/clienteApi';

export const FormIngresarActividad = () => {
  const { register, handleSubmit, formState: { errors }, control, reset } = useForm();
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState({ value: '0', label: 'Seleccione un Cliente' });
  const [apiCalled, setApiCalled] = useState(false); // Indicador para controlar si se llamó a la API

  const onSubmit = handleSubmit(async (values) => {
    try {
      // Incrementar un día a las fechas antes de enviarlas
      const formattedEvent = {
        ...values,
        fechaEntrega: moment(values.fechaEntrega).add(1, 'day').format('YYYY-MM-DD'),
        fechaInicio: moment(values.fechaInicio).add(1, 'day').format('YYYY-MM-DD'),
        fechaFinal: moment(values.fechaFinal).add(1, 'day').format('YYYY-MM-DD'),
        idCliente: selectedCliente.value // Usar el valor seleccionado del cliente
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
      setSelectedCliente({ value: '0', label: 'Seleccione un Cliente' }); // Restablecer el cliente seleccionado
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Error al crear la actividad');
    }
  });

  // Mueve la declaración de la función getClientes aquí
  async function getClientes() {
    try {
      const response = await obtenerClientes();
      const clienteData = response.data;
      setClientes(clienteData);
    } catch (error) {
      console.error('Error al obtener las actividades:', error);
    }
  }

  useEffect(() => {
    if (!apiCalled) {
      // Realizar la llamada a la API solo si no se ha llamado previamente
      getClientes(); // Llama a la función aquí
      setApiCalled(true); // Establecer el indicador de llamada a la API como true después de la llamada
    }
  }, [apiCalled]); // El useEffect se ejecutará cuando apiCalled cambie

  return (
    <>
      {/* Aquí debes completar tu formulario */}
      <form onSubmit={onSubmit}>
        <div style={{ display: 'flex', marginTop: 15, marginLeft: 15 }}>
          <TextField type='text' {...register("nombreActividad")} placeholder='Nombre de Actividad' style={{ marginRight: 15, width: 300 }} />
          <TextField type='text' {...register("descripcionActividad")} placeholder='Descripcion de Actividad' multiline style={{width: 300}} />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', marginTop: 15, marginLeft: 15}}>
          <Typography variant='h6'>Fecha de Entrega</Typography>
          <TextField type='date' {...register("fechaEntrega")} style={{width: 620}} />
        </div>
        <div style={{display: 'flex', marginTop: 15, marginLeft: 15}}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <Typography variant='h6'>Fecha de Inicio</Typography>
            <TextField type='date' {...register("fechaInicio")} style={{marginRight: 15, width: 304}} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <Typography variant='h6'>Fecha de Final</Typography>
            <TextField type='date' {...register("fechaFinal")} style={{width: 304}} />
          </div>
        </div>
        <div style={{marginTop: 15, marginLeft: 15}}>
          <TextField type='text' {...register("estadoActividad")} defaultValue="Pendiente" style={{width: 620}} />
        </div>
        <div style={{ marginTop: 15, marginLeft: 15, width: 620 }}>
          <Controller
            name="idCliente"
            control={control}
            defaultValue="0" // Establece '0' como valor inicial para el campo
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: '0', label: 'Seleccione un Cliente' },
                  ...clientes.map(cliente => ({
                    value: cliente.idCliente,
                    label: cliente.nombreClient,
                  }))
                ]}
                value={selectedCliente}
                onChange={(selectedOption) => {
                  setSelectedCliente(selectedOption); // Actualizar el estado con la opción seleccionada
                  field.onChange(selectedOption?.value || '0'); // Actualizar el valor en React Hook Form
                }}
                isClearable
              />
            )}
          />
        </div>
        <div style={{ marginTop: 15, marginLeft: 15 }}>
          <Button type='submit' variant="contained" startIcon={<SendIcon />}>Enviar</Button>
        </div>
      </form>
    </>
  );
};
