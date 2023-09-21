import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { actividadDatos } from '../../api/actividadApi';

export const FormIngresarActividad = ({ clientes }) => {
    console.log(clientes);
  const { register, handleSubmit, formState: { errors }, control, reset } = useForm();
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [newEvent, setNewEvent] = useState({
    fechaEntrega: '',
    fechaInicio: '',
    fechaFinal: '',
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const formattedEvent = {
        ...values,
        fechaEntrega: moment(newEvent.fechaEntrega).add(1, 'day').startOf('day').format('YYYY-MM-DD'),
        fechaInicio: moment(newEvent.fechaInicio).add(1, 'day').startOf('day').format('YYYY-MM-DD'),
        fechaFinal: moment(newEvent.fechaFinal).add(1, 'day').startOf('day').format('YYYY-MM-DD'),
        idCliente: selectedCliente.value // Usar el valor seleccionado del cliente
      };
      await actividadDatos(formattedEvent);
      toast.success('Actividad Creada');
      // Restablecer los valores del formulario y el estado
      reset({
        nombreActividad: '',
        descripcionActividad: '',
        idCliente: '',
      });
      setNewEvent({
        fechaEntrega: '',
        fechaInicio: '',
        fechaFinal: '',
      });
      setSelectedCliente(null); // Restablecer el cliente seleccionado
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Error al crear la actividad');
    }
  });

  // El resto de tu componente...

  return (
    <>
      {/* Aquí debes completar tu formulario */}
      <form onSubmit={onSubmit}>
        {/* Campo de cliente usando Controller */}
        <Controller
          name="idCliente"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <Select
              {...field}
              options={clientes.map(cliente => ({
                value: cliente.idCliente,
                label: cliente.nombreClient,
              }))}
              value={selectedCliente}
              onChange={(selectedOption) => {
                setSelectedCliente(selectedOption); // Actualizar el estado con la opción seleccionada
                field.onChange(selectedOption); // Actualizar el valor en React Hook Form
              }}
              isClearable
              placeholder="Seleccione un Cliente"
            />
          )}
        />
        {/* ... Otros campos de formulario y botones ... */}
      </form>
    </>
  );
};
