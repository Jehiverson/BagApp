import React, { useEffect } from 'react';
// Importa React y varios hooks, incluido useState y useEffect.
import { useForm, Controller } from 'react-hook-form';
// Importa el hook useForm y el componente Controller de react-hook-form, que se utilizan para manejar formularios de React de manera eficiente.
// Enlace de la documentacion de react-hook-form: https://react-hook-form.com/
import { Button, TextField, RadioGroup, FormControlLabel, Radio } from "@mui/material";
// Importa varios componentes de Material-UI.
// Enlace de la documentacion de Material-UI: https://mui.com/
import SendIcon from "@mui/icons-material/Send";
// Importa el icono SendIcon de Material-UI.
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Importa la biblioteca react-toastify para mostrar notificaciones de tostadas en la interfaz de usuario.
// Enlace de documentacion de react-toastify: https://www.npmjs.com/package/react-toastify
import { actualizacionPago } from "../../api/pagoApi";
// Importamos mis APIS

export const FormActualizarPago = ({ cliente, closeModal, getPagos }) => {
  // Define el componente FormActualizarPago, que recibe tres propiedades: cliente, closeModal y getPagos.

  // Utiliza useForm para manejar el formulario y desestructura sus funciones y objetos relacionados.
  const { control, handleSubmit, reset, register } = useForm();

  useEffect(() => {
    // Resetea el formulario con los datos del cliente seleccionado cuando cliente cambia.
    if (cliente) {
      reset(cliente);
    }
  }, [cliente, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      // Realiza la actualización del cliente con los nuevos datos utilizando la función actualizacionPago.
      await actualizacionPago(values.idPago, values);
      toast.success("Pago actualizado exitosamente"); // Muestra una notificación de éxito.
      closeModal(); // Cierra el modal.
      getPagos(); // Actualiza la lista de pagos.
    } catch (error) {
      console.error("Error al actualizar el pago:", error); // Registra un error en la consola.
      toast.error("Error al actualizar el pago"); // Muestra una notificación de error.
    }
  });

  return (
    <form onSubmit={onSubmit}>
      {/* Renderiza varios campos de entrada de datos utilizando TextField de Material-UI. */}
      <TextField
        type="text"
        {...register("nombre")}
        label="Nombre"
        fullWidth
      />
      <TextField
        type="text"
        {...register("apellido")}
        label="Apellido"
        fullWidth
        style={{ marginTop: 15 }}
      />
      <TextField
        type="date"
        {...register("fechaPago")}
        fullWidth
        style={{ marginTop: 15 }}
      />
      <TextField
        type="text"
        {...register("monto")}
        fullWidth
        label="Monto"
        style={{ marginTop: 15 }}
      />
      <TextField
        type="text"
        {...register("noVoucher")}
        label="Voucher"
        fullWidth
        style={{ marginTop: 15 }}
      />

      {/* Renderiza un grupo de botones de opción de RadioGroup de Material-UI para el campo "tipoPago". */}
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
              <FormControlLabel value="voucher" control={<Radio />} label="Voucher" />
            </RadioGroup>
          )}
        />
      </div>

      {/* Renderiza campos adicionales de entrada de datos. */}
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

      {/* Renderiza un botón para enviar el formulario. */}
      <div style={{ marginTop: 15 }}>
        <Button type="submit" variant="contained" startIcon={<SendIcon />}>
          Actualizar Pago
        </Button>
      </div>
    </form>
  );
};
