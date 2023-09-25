import { TextField, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import moment from 'moment';
import { useForm, Controller } from 'react-hook-form';
import SendIcon from '@mui/icons-material/Send';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { obtenerClientes } from '../../api/clienteApi';
import { actualizarActividad } from '../../api/actividadApi';

export const FormActualizarEvento = ({ selectedEvent, setSelectedEvent, fetchEvents }) => {
  const { register, handleSubmit, formState: { errors }, control, reset, setValue } = useForm();
  const [clienteOptions, setClienteOptions] = useState([]);
  const [selectedClienteCambio, setSelectedClienteCambio] = useState(null);
  const [datosCargados, setDatosCargados] = useState(false);

  // Mueve la función cargarDatosClientes fuera del useEffect
  const cargarDatosClientes = async () => {
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

      setClienteOptions(clienteFormato);

      const clienteSeleccionado = clienteFormato.find(cliente => cliente.value === selectedEvent.idCliente);

      if (clienteSeleccionado) {
        setSelectedClienteCambio(clienteSeleccionado);
      }

      setDatosCargados(true);
    } catch (error) {
      console.error('Error al obtener los datos de Pagos', error);
    }
  };

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
      setValue("idCliente", selectedEvent.idCliente);
      setValue("fechaEntrega", moment(selectedEvent.fechaEntrega).format('YYYY-MM-DD'));
      setValue("fechaInicio", moment(selectedEvent.fechaInicio).format('YYYY-MM-DD'));
      setValue("fechaFinal", moment(selectedEvent.fechaFinal).format('YYYY-MM-DD'));

      cargarDatosClientes().then(() => {
        setValue("idCliente", selectedEvent.idCliente);
      });
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
        <div style={{ marginTop: 15, width: 350 }}>
        <Controller
          name="idCliente"
          control={control}
          defaultValue={selectedClienteCambio?.value || null} // Usa defaultValue en lugar de value
          render={({ field }) => (
            <Select
              {...field}
              sx={{ marginTop: 10 }}
              onChange={(selectedOption) => {
                console.log("Selected Option:", selectedOption);
                setSelectedClienteCambio(selectedOption);
                field.onChange(selectedOption ? selectedOption.value : null); // Actualiza el valor del campo con el id del cliente seleccionado
              }}
              options={clienteOptions}
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
