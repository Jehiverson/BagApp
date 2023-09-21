import { TextField, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import moment from 'moment';
import { useForm, Controller } from 'react-hook-form';
import SendIcon from '@mui/icons-material/Send';
import { obtenerClientes } from '../../api/clienteApi';

export const FormActualizarEvento = ({ selectedEvent }) => {
  const { register, handleSubmit, formState: { errors }, control, reset, setValue } = useForm();
  const [cliente, setCliente] = useState('');
  const [selectedClienteCambio, setSelectedClienteCambio] = useState(null); // Cambia a null para manejar el objeto completo

  const onSubmit = handleSubmit(async (values) => {
    console.log(values);
    reset();
  });

  useEffect(() => {
    // Establecer los valores iniciales de los campos del formulario
    setValue("nombreActividad", selectedEvent.title);
    setValue("descripcionActividad", selectedEvent.descripcionActividad);
    setValue("idCliente", selectedEvent.idCliente);
    setValue("fechaEntrega", moment(selectedEvent.fechaEntrega).format('YYYY-MM-DD'));
    setValue("fechaInicio", moment(selectedEvent.fechaInicio).format('YYYY-MM-DD'));
    setValue("fechaFinal", moment(selectedEvent.fechaFinal).format('YYYY-MM-DD'));

    async function DatosClientes() {
      try {
        const response = await obtenerClientes();
        const pagoData = response.data;

        const clienteFormato = pagoData.map(cliente => ({
          value: cliente.idCliente,
          label: cliente.nombreClient,
        }));

        clienteFormato.unshift({
          value: 0,
          label: 'Seleccione un Cliente',
        });

        // Buscar el cliente que coincida con selectedEvent.idCliente
        const clienteSeleccionado = clienteFormato.find(cliente => cliente.value === selectedEvent.idCliente);

        if (clienteSeleccionado) {
          setSelectedClienteCambio(clienteSeleccionado);
        }

        setCliente(clienteFormato);
      } catch (error) {
        console.error('Error al obtener los datos de Pagos', error);
      }
    }
    DatosClientes();
  }, [selectedEvent]);

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
        <div style={{ marginTop: 15, width: 350 }}>
          <Controller
            name="idCliente"
            control={control}
            defaultValue={selectedClienteCambio} // Usa defaultValue en lugar de value
            render={({ field }) => (
              <Select
                {...field}
                sx={{ marginTop: 10 }}
                onChange={(selectedOption) => {
                  setSelectedClienteCambio(selectedOption);
                  field.onChange(selectedOption ? selectedOption.value : null); // Actualiza el valor del campo con el id del cliente seleccionado
                }}
                options={cliente}
                isClearable
                placeholder="Seleccione un Cliente"
                menuPlacement='auto'
                maxMenuHeight={100}
              />
            )}
          />
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
