import { FormControlLabel, RadioGroup, TextField, Radio, Typography, Button } from '@mui/material';
import React, {useState, useEffect} from 'react'
import { useForm, Controller} from 'react-hook-form'
import Select from 'react-select';
import SendIcon from '@mui/icons-material/Send';
import {v4 as uuidv4} from 'uuid';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { pagarDatos } from '../../api/pagoApi';
import {obtenerClientes} from '../../api/clienteApi';

export const FormPago = ({idActividad, setSelectedEvent}) => {
    const { handleSubmit, register, control, reset } = useForm();
    const [showVoucher, setShowVoucher] = useState(false);
    const [actividades, setActividades] = useState([]);
    const [datosCargados, setDatosCargados] = useState(false);
    const [selectedClienteCambio, setSelectedClienteCambio] = useState(null);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const idPago = uuidv4();
            idActividad = data.idActividad; // Usar el idActividad existente en field
            data.idPago = idPago;
            await pagarDatos({
              ...data,
              idCliente: data.idCliente ? data.idCliente.value : null, // Usar el valor 'value' del objeto seleccionado o nulo si no hay selección
            });
            toast.success("Pago efectuado");
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
            });
            setSelectedEvent(null);
          } catch (error) {
            console.error("Error al pagar", error);
            toast.error("Error al Pagar");
          }
    });

    const getActividades = async () => {
      try {
        const response = await obtenerClientes();
        const actividadesData = response.data;
  
        const actividadesFormatted = actividadesData.map(actividad => ({
          value: actividad.idCliente,
          label: actividad.nombreClient
        }));
  
        actividadesFormatted.unshift({
          value: 0,
          label: 'Seleccione un Cliente'
        });
  
        setActividades(actividadesFormatted);
        setDatosCargados(true); // Marcar como datos cargados una vez que se han obtenido
      } catch (error) {
        console.error('Error al obtener las actividades:', error);
      }
    };

    useEffect(() => {
      if (!datosCargados) {
        getActividades();
      }
    }, [datosCargados]);

    return (
        <>
            <form onSubmit={onSubmit}>
                <Typography variant='h6'>Forma de Pago</Typography>
                <Controller
                  name="tipoPago"
                  control={control}
                  defaultValue="efectivo" // Establece el valor inicial deseado
                  render={({ field }) => (
                    <RadioGroup
                      aria-label="payment-method"
                      name="paymentMethod"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value === 'voucher') {
                          // Mostrar el TextField de Voucher si se selecciona 'voucher'
                          setShowVoucher(true);
                        } else {
                          // Ocultar el TextField de Voucher si se selecciona 'efectivo'
                          setShowVoucher(false);
                        }
                      }}
                    >
                      <div style={{display: "flex", marginTop: "15px", marginLeft: "20px"}}>
                        <FormControlLabel value="efectivo" control={<Radio />} label="Efectivo" />
                        <FormControlLabel value="voucher" control={<Radio />} label="Voucher" />
                      </div>
                    </RadioGroup>
                  )}
                />
                {showVoucher ? (
                    <div style={{marginBottom: 15}}>
                        <Typography variant='h6'>Voucher</Typography>
                        <TextField type='text' {...register("noVoucher")} placeholder='Voucher' />
                    </div>
                 ) : null}
                <div style={{ display: 'flex' }}>
                  <div>
                    <Typography variant='h6'>Nombre</Typography>
                    <TextField type='text' {...register("nombre")} placeholder="Nombre" style={{ marginRight: 25 }} />
                  </div>
                  <div>
                    <Typography variant='h6'>Apellido</Typography>
                    <TextField type='text' {...register("apellido")} placeholder="Apellido" />
                  </div>
                </div>
                <div style={{display: '-webkit-inline-flex'}}>
                    {showVoucher ? (<div style={{marginTop: 15, marginRight: 15}}>
                        <Typography variant='h6'>Fecha de Pago</Typography>
                        <TextField type='date' {...register("fechaPago")} style={{width: 150, marginRight: 10}} />
                    </div>
                    ) : null}
                    <div style={{marginTop: 15, marginRight: 15}}>
                        <Typography variant='h6'>Monto</Typography>
                        <TextField type='text' {...register("monto")} placeholder='Monto' />
                    </div>
                      <div style={{marginTop: 15}}>
                          <Typography variant='h6'>Actividad</Typography>
                          <TextField type='text' {...register("idActividad")} value={idActividad} placeholder='Actividad' />
                      </div>
                </div>
                <div style={{ marginTop: 10 }}>
                <Typography variant='h6'>Clientes</Typography>
                    <Controller
                        name="idCliente"
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
                                placeholder="Seleccione un Cliente"
                                menuPlacement='auto'
                                maxMenuHeight={100}
                            />
                        )}
                    />
                </div>
                <div style={{marginTop: 15}}>
                    <Typography variant='h6'>Descripcion</Typography>
                    <TextField type='text' {...register("descripcion")} placeholder='Descripcion' multiline fullWidth />
                </div>
                {showVoucher ? (
                  <div style={{marginTop: 15}}>
                      <Typography variant='h6'>NIT</Typography>
                      <TextField type='text' {...register("nit")} placeholder='NIT' fullWidth />
                  </div>
                ) : null}
                <div style={{marginTop: 15}}>
                    <Button type='submit' variant='contained' startIcon={<SendIcon />}>Enviar</Button>
                </div>
            </form>
        </>
    );
}
