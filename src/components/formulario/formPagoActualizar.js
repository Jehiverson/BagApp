import React, { useEffect } from "react";
import { useForm, Controller} from "react-hook-form";
import { Button, TextField, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
import { actualizacionPago } from "../../api/pagoApi";

export const FormActualizarPago = ({ cliente, closeModal, getPagos }) => {
  const { control, handleSubmit, reset, register } = useForm();

  useEffect(() => {
    // Resetea el formulario con los datos del cliente seleccionado
    if (cliente) {
      reset(cliente);
    }
  }, [cliente, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      // Realiza la actualización del cliente con los nuevos datos
      await actualizacionPago(values.idPago, values);
      toast.success("Pago actualizado exitosamente");
      closeModal();
      getPagos();
    } catch (error) {
      console.error("Error al actualizar el pago:", error);
      toast.error("Error al actualizar el pago");
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <TextField
        type="text"
        {...register("nombre")}
        label="Nombre"
        fullWidth
      />
      <TextField
        type="text"
        {...register("apellido")}
        label="Apellido "
        fullWidth
        style={{marginTop: 15}}
      />
      <TextField
        type="date"
        {...register("fechaPago")}
        fullWidth
        style={{marginTop: 15}}
      />
      <TextField
        type="text"
        {...register("monto")}
        fullWidth
        label="Monto"
        style={{marginTop: 15}}
      />
      <TextField
        type="text"
        {...register("noVoucher")}
        label="Voucher"
        fullWidth
        style={{marginTop: 15}}
      />
      <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
        <h5 style={{ margin: "0", marginRight: "16px" }}>Tipo Pago:</h5>
        <Controller
          name="tipoPago"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <RadioGroup
              aria-label="Tipo Pago"
              {...field}
              row
              sx={{ marginBottom: 2 }}
            >
              <FormControlLabel value="efectivo" control={<Radio />} label="Efectivo" />
              <FormControlLabel value="voucher" control={<Radio />} label="voucher" />
            </RadioGroup>
          )}
        />
      </div>
      <TextField
        type="text"
        label="NIT"
        fullWidth
        {...register("nit")}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        type="text"
        label="Descripcion"
        {...register("descripcion")}
        fullWidth
      />
      <div style={{ marginTop: 15 }}>
        <Button type="submit" variant="contained" startIcon={<SendIcon />}>
          Actualizar Pago
        </Button>
      </div>
    </form>
  );
};
