// Importación de bibliotecas y componentes con enlaces a la documentación
import { Button, Typography } from '@mui/material'; // Importación de componentes de Material-UI. Documentación: https://mui.com/components/text-fields/
import React, { useEffect, useState } from 'react';
import Select from 'react-select'; // Importación de react-select para selección de opciones. Documentación: https://react-select.com/
import { useForm, Controller } from 'react-hook-form'; // Importación de react-hook-form para la gestión de formularios. Documentación: https://react-hook-form.com/
import { toast } from 'react-toastify'; // Importación de react-toastify para notificaciones. Documentación: https://github.com/fkhadra/react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Estilos para react-toastify
import SendIcon from '@mui/icons-material/Send';
import { pagoUnion, cambioActividadPago } from '../../api/pagoApi'; // Importación de funciones personalizadas para la API de pagos.
import { obtenerActividades } from '../../api/actividadApi'; // Importación de funciones personalizadas para la API de actividades.

export const FormCambioEvento = () => {
  const { handleSubmit, control, reset } = useForm();
  const [pago, setPago] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [selectedClientePago, setSelectedClientePago] = useState(null);
  const [selectedClienteCambio, setSelectedClienteCambio] = useState(null);
  const [datosCargados, setDatosCargados] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const idPago = values.idPago.value;
      const idActividad = values.idActividad.value;

      await cambioActividadPago(idPago, idActividad);
      toast.success("Cambio de Actividad Exitosa"); // Muestra una notificación de éxito
      setSelectedClientePago(null);
      setSelectedClienteCambio(null);
      reset();
    } catch (error) {
      toast.error("Actualización Denegada"); // Muestra una notificación de error
      console.log(error);
    }
  });

  const DatosPagos = async () => {
    try {
      const response = await pagoUnion();
      const pagoData = response.data;

      const pagoFormato = pagoData.map(pago => ({
        value: pago.idPago,
        label: `${pago.actividad.nombreActividad} - ${pago.nombre} ${pago.apellido}`
      }));

      pagoFormato.unshift({
        value: 0,
        label: 'Seleccione un Cliente'
      });

      setPago(pagoFormato);
    } catch (error) {
      console.error('Error al obtener los datos de Pagos', error);
    }
  };

  const getActividades = async () => {
    try {
      const response = await obtenerActividades();
      const actividadesData = response.data;

      const actividadesFormatted = actividadesData.map(actividad => ({
        value: actividad.idActividad,
        label: actividad.nombreActividad
      }));

      actividadesFormatted.unshift({
        value: 0,
        label: 'Seleccione una Actividad'
      });

      setActividades(actividadesFormatted);
      setDatosCargados(true); // Marcar como datos cargados una vez que se han obtenido
    } catch (error) {
      console.error('Error al obtener las actividades:', error);
    }
  };

  useEffect(() => {
    if (!datosCargados) {
      DatosPagos();
      getActividades();
    }
  }, [datosCargados]);

  return (
    <form onSubmit={onSubmit}>
        <div style={{marginLeft: 20, marginBottom: 10}}>
            <Typography variant='h6'>Cambio de Actividad</Typography>
            <Typography variant='h7'>Cambia de Actividad previamente pagada</Typography>
        </div>
      <div style={{ display: 'flex' }}>
        <div style={{paddingBottom: 20, paddingLeft: 20, paddingRight: 20}}>
            <Controller
            name="idPago"
            control={control}
            defaultValue={null}
            render={({ field }) => (
                <Select
                    {...field}
                    sx={{ marginRight: 2, marginTop: 10 }}
                    value={selectedClientePago}
                    onChange={(selectedOption) => {
                        setSelectedClientePago(selectedOption);
                        field.onChange(selectedOption);
                    }}
                    options={pago}
                    isClearable
                    placeholder="Seleccione un Cliente para Pago"
                    menuPlacement='auto'
                    maxMenuHeight={100}
                />
            )}
            />
        </div>

        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Controller
                name="idActividad"
                control={control}
                defaultValue={null}
                render={({ field }) => (
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
                        placeholder="Seleccione una Actividad para Cambio"
                        menuPlacement='auto'
                        maxMenuHeight={100}
                    />
                )}
            />
        </div>
        <div style={{ marginLeft: 10 }}>
            <Button type="submit" variant="contained" endIcon={<SendIcon />}>
            Enviar
            </Button>
      </div>
      </div>
    </form>
  );
};
