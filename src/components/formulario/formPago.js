import { FormControlLabel, RadioGroup, TextField, Radio, Typography, Button } from '@mui/material';
import React, {useState} from 'react'
import { useForm, Controller} from 'react-hook-form'
import SendIcon from '@mui/icons-material/Send';
import {v4 as uuidv4} from 'uuid';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { pagarDatos } from '../../api/pagoApi';
import { actividadPago } from '../../api/actividadApi';

export const FormPago = ({idActividad}) => {
    const { handleSubmit, register, control, reset } = useForm();
    const [showVoucher, setShowVoucher] = useState(false);
    const localStorageUser = JSON.parse(localStorage.getItem('user'));
    const idCliente = localStorageUser ? localStorageUser.idCliente : null;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const idPago = uuidv4();
            console.log(idPago)
            idActividad = data.idActividad; // Usar el idActividad existente en field
            data.idPago = idPago;
            data.idCliente = idCliente;
            await pagarDatos(data);
            await actividadPago(idActividad, idPago); // Enviar solo el idActividad
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
          } catch (error) {
            console.error("Error al pagar", error);
            toast.error("Error al Pagar");
          }
    });

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
                        <TextField type='text' {...register("noVoucher")} placeholder='Voucher' />
                    </div>
                ) : null}
                <div style={{display: 'flex'}}>
                    <TextField type='text' {...register("nombre")} placeholder="Nombre" style={{marginRight: 25}} />
                    <TextField type='text' {...register("apellido")} placeholder="Apellido" />
                </div>
                <div style={{display: '-webkit-inline-flex'}}>
                    {showVoucher ? (
                        <div style={{marginTop: 15, marginRight: 15}}>
                            <TextField type='date' {...register("fechaPago")} />
                        </div>
                    ) : null}
                    <div style={{marginTop: 15, marginRight: 15}}>
                        <TextField type='text' {...register("monto")} placeholder='Monto' />
                    </div>
                    <div style={{marginTop: 15}}>
                        <TextField type='text' {...register("idActividad")} value={idActividad} placeholder='Actividad' />
                    </div>
                </div>
                <div style={{marginTop: 15}}>
                    <TextField type='text' {...register("descripcion")} placeholder='Descripcion' multiline />
                </div>
                {showVoucher ? (
                    <div style={{marginTop: 15}}>
                        <TextField type='text' {...register("nit")} placeholder='NIT' />
                    </div>
                ) : null}
                <div style={{marginTop: 15}}>
                    <Button type='submit' variant='contained' startIcon={<SendIcon />}>Enviar</Button>
                </div>
            </form>
        </>
    );
}
