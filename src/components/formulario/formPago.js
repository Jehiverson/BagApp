import { FormControlLabel, RadioGroup, TextField, Radio, Typography, Button } from '@mui/material';
// Importa varios componentes de Material-UI.
// Enlace de la documentacion de Material-UI: https://mui.com/
import React, { useState, useEffect } from 'react';
// Importa React y varios hooks, incluido useState y useEffect.

import { useForm, Controller } from 'react-hook-form';
// Importa el hook useForm y el componente Controller de react-hook-form, que se utilizan para manejar formularios de React de manera eficiente.
// Enlace de la documentacion de react-hook-form: https://react-hook-form.com/
import Select from 'react-select';
// Importa el componente Select de la biblioteca react-select, que se utiliza para crear una lista desplegable de opciones.
// Enlace de documentacion de react-select_ https://react-select.com/home
import SendIcon from '@mui/icons-material/Send';
// Importa el icono SendIcon de Material-UI.

import { v4 as uuidv4 } from 'uuid';
// Importa la función uuidv4 de la biblioteca uuid, que se utiliza para generar identificadores únicos.
// Enlace de documentacion de uuid: https://www.npmjs.com/package/uuid
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Importa la biblioteca react-toastify para mostrar notificaciones de tostadas en la interfaz de usuario.
// Enlace de documentacion de react-toastify: https://www.npmjs.com/package/react-toastify
import { pagarDatos } from '../../api/pagoApi';
import { obtenerClientes } from '../../api/clienteApi';
// Importa funciones relacionadas con el manejo de pagos y clientes desde rutas relativas.

export const FormPago = ({ idActividad, setSelectedEvent }) => {
  // Define el componente FormPago como una función que recibe dos propiedades: idActividad y setSelectedEvent.

  const { handleSubmit, register, control, reset } = useForm();
  // Inicializa el hook useForm y desestructura sus funciones necesarias, como handleSubmit, register, control y reset.

  const [showVoucher, setShowVoucher] = useState(false);
  // Define un estado local 'showVoucher' con el valor inicial 'false' para controlar la visibilidad de un campo de voucher en el formulario.

  const [actividades, setActividades] = useState([]);
  // Define un estado local 'actividades' como un arreglo vacío para almacenar opciones de actividades.

  const [datosCargados, setDatosCargados] = useState(false);
  // Define un estado local 'datosCargados' con el valor inicial 'false' para controlar si los datos de actividades se han cargado.

  const [selectedClienteCambio, setSelectedClienteCambio] = useState(null);
  // Define un estado local 'selectedClienteCambio' con el valor inicial 'null' para controlar la selección de un cliente en el formulario.

  const onSubmit = handleSubmit(async (data) => {
    // Define una función 'onSubmit' que se ejecuta al enviar el formulario.
    try {
      const idPago = uuidv4(); // Genera un ID de pago único.
      idActividad = data.idActividad; // Usa el 'idActividad' existente en 'field'.
      data.idPago = idPago; // Agrega el ID de pago a los datos del formulario.
      await pagarDatos({
        ...data,
        idCliente: data.idCliente ? data.idCliente.value : null, // Usa el valor 'value' del cliente seleccionado o nulo si no hay selección.
      });
      toast.success("Pago efectuado"); // Muestra una notificación de éxito.
      reset({
        tipoPago: 'efectivo',
        noVoucher: '',
        nombre: '',
        apellido: '',
        fechaPago: new Date(),
        actividad: null,
        monto: '',
        descripcion: '',
        nit: '',
      }); // Restablece el formulario a sus valores iniciales.
      setSelectedEvent(null); // Establece 'selectedEvent' en 'null'.
    } catch (error) {
      console.error("Error al pagar", error); // Registra un error en la consola.
      toast.error("Error al Pagar"); // Muestra una notificación de error.
    }
  });

  const getActividades = async () => {
    // Define una función asincrónica 'getActividades' para obtener las actividades.
    try {
      const response = await obtenerClientes(); // Realiza una solicitud para obtener clientes.
      const actividadesData = response.data; // Obtiene los datos de las actividades.

      const actividadesFormatted = actividadesData.map((actividad) => ({
        value: actividad.idCliente,
        label: actividad.nombreClient,
      }));
      // Formatea los datos de actividades para usarlos en react-select.

      actividadesFormatted.unshift({
        value: 0,
        label: 'Seleccione un Cliente',
      });
      // Agrega una opción predeterminada al principio del arreglo de actividades.

      setActividades(actividadesFormatted); // Establece las actividades formateadas en el estado local.
      setDatosCargados(true); // Marca los datos como cargados una vez obtenidos.
    } catch (error) {
      console.error('Error al obtener las actividades:', error); // Registra un error en la consola.
    }
  };

  useEffect(() => {
    // Utiliza useEffect para cargar las actividades una vez cuando 'datosCargados' es falso.
    if (!datosCargados) {
      getActividades();
    }
  }, [datosCargados]);

  return (
    <>
      <form onSubmit={onSubmit}>
        {/* Renderiza un formulario con un controlador de eventos onSubmit. */}
        <Typography variant='h6'>Forma de Pago</Typography>
        {/* Renderiza un encabezado de título. */}
        <Controller
          name='tipoPago'
          control={control}
          defaultValue='efectivo'
          render={({ field }) => (
            // Utiliza el componente Controller para manejar el campo 'tipoPago'.
            <RadioGroup
              aria-label='payment-method'
              name='paymentMethod'
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
                if (e.target.value === 'voucher') {
                  setShowVoucher(true);
                } else {
                  setShowVoucher(false);
                }
              }}
            >
              <div style={{ display: 'flex', marginTop: '15px', marginLeft: '20px' }}>
                <FormControlLabel value='efectivo' control={<Radio />} label='Efectivo' />
                <FormControlLabel value='voucher' control={<Radio />} label='Voucher' />
              </div>
            </RadioGroup>
          )}
        />
        {showVoucher ? (
          <div style={{ marginBottom: 15 }}>
            <Typography variant='h6'>Voucher</Typography>
            <TextField type='text' {...register('noVoucher')} placeholder='Voucher' />
          </div>
        ) : null}
        {/* Renderiza un campo de voucher si 'showVoucher' es verdadero. */}
        <div style={{ display: 'flex' }}>
          <div>
            <Typography variant='h6'>Nombre</Typography>
            <TextField type='text' {...register('nombre')} placeholder='Nombre' style={{ marginRight: 25 }} />
          </div>
          <div>
            <Typography variant='h6'>Apellido</Typography>
            <TextField type='text' {...register('apellido')} placeholder='Apellido' />
          </div>
        </div>
        {/* Renderiza campos de nombre y apellido. */}
        <div style={{ display: '-webkit-inline-flex' }}>
          {showVoucher ? (
            <div style={{ marginTop: 15, marginRight: 15 }}>
              <Typography variant='h6'>Fecha de Pago</Typography>
              <TextField type='date' {...register('fechaPago')} style={{ width: 150, marginRight: 10 }} />
            </div>
          ) : null}
          <div style={{ marginTop: 15, marginRight: 15 }}>
            <Typography variant='h6'>Monto</Typography>
            <TextField type='text' {...register('monto')} placeholder='Monto' />
          </div>
          <div style={{ marginTop: 15 }}>
            <Typography variant='h6'>Actividad</Typography>
            <TextField type='text' {...register('idActividad')} value={idActividad} placeholder='Actividad' />
          </div>
        </div>
        {/* Renderiza campos de fecha de pago, monto y actividad. */}
        <div style={{ marginTop: 10 }}>
          <Typography variant='h6'>Clientes</Typography>
          <Controller
            name='idCliente'
            control={control}
            defaultValue={null}
            render={({ field }) => (
              // Utiliza el componente Controller para manejar el campo 'idCliente'.
              <Select
                {...field}
                sx={{ marginTop: 10 }}
                value={selectedClienteCambio}
                onChange={(selectedOption) => {
                  setSelectedClienteCambio(selectedOption);
                  field.onChange(selectedOption);
                }}
                options={actividades}
                isClearable
                placeholder='Seleccione un Cliente'
                menuPlacement='auto'
                maxMenuHeight={100}
              />
            )}
          />
        </div>
        {/* Renderiza un campo de selección de cliente utilizando react-select. */}
        <div style={{ marginTop: 15 }}>
          <Typography variant='h6'>Descripcion</Typography>
          <TextField type='text' {...register('descripcion')} placeholder='Descripcion' multiline fullWidth />
        </div>
        {/* Renderiza un campo de descripción. */}
        {showVoucher ? (
          <div style={{ marginTop: 15 }}>
            <Typography variant='h6'>NIT</Typography>
            <TextField type='text' {...register('nit')} placeholder='NIT' fullWidth />
          </div>
        ) : null}
        {/* Renderiza un campo de NIT si 'showVoucher' es verdadero. */}
        <div style={{ marginTop: 15 }}>
          <Button type='submit' variant='contained' startIcon={<SendIcon />}>
            Enviar
          </Button>
        </div>
        {/* Renderiza un botón de envío del formulario. */}
      </form>
    </>
  );
};
