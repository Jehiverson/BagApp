import React, { useEffect } from "react";
import {
  useForm,
  Controller,
} from "react-hook-form";
import {
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
} from "@mui/material"; // Importación de componentes de Material-UI. Documentación: https://mui.com/components/text-fields/
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify"; // Importación de la biblioteca react-toastify para notificaciones. Documentación: https://github.com/fkhadra/react-toastify
import { actualizarCliente } from "../../api/clienteApi"; // Importación de la función para actualizar clientes desde una API personalizada.

const estadosCiviles = [
  "Soltero/a",
  "Casado/a",
  "Divorciado/a",
  "Viudo/a",
  "Separado/a",
];

export const FormActualizarCliente = ({ cliente, closeModal }) => {
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
      await actualizarCliente(values.idCliente, values);
      toast.success("Cliente actualizado exitosamente"); // Muestra una notificación de éxito
      closeModal(); // Cierra el modal después de la actualización
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);
      toast.error("Error al actualizar el cliente"); // Muestra una notificación de error
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <TextField
        type="text"
        {...register("nombreClient")}
        label="Nombre del Cliente"
        fullWidth
      />
      <TextField
        type="text"
        {...register("apellidoClient")}
        label="Apellido del Cliente"
        fullWidth
        style={{ marginTop: 15 }}
      />
      <TextField
        type="date"
        {...register("fechaNacimiento")}
        fullWidth
        style={{ marginTop: 15 }}
      />
      <TextField
        type="text"
        {...register("dpi")}
        fullWidth
        label="DPI"
        style={{ marginTop: 15 }}
      />
      <TextField
        type="text"
        {...register("telefono")}
        label="Telefono del Cliente"
        fullWidth
        style={{ marginTop: 15 }}
      />
      <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
        <h5 style={{ margin: "0", marginRight: "16px" }}>Genero:</h5>
        <Controller
          name="genero"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <RadioGroup
              aria-label="Genero"
              {...field}
              row
              sx={{ marginBottom: 2 }}
            >
              <FormControlLabel value="M" control={<Radio />} label="M" />
              <FormControlLabel value="H" control={<Radio />} label="H" />
              <FormControlLabel value="otro" control={<Radio />} label="Otro" />
            </RadioGroup>
          )}
        />
      </div>
      <Controller
        name="estadoCivil"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            select
            label="Estado Civil"
            fullWidth
            {...field}
          >
            {estadosCiviles.map((estadoCivil) => (
              <MenuItem key={estadoCivil} value={estadoCivil}>
                {estadoCivil}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
        <h5 style={{ margin: "0", marginRight: "16px" }}>¿Está Trabajando?</h5>
        <Controller
          name="trabajando"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <RadioGroup
              aria-label="Trabajando"
              {...field}
              row
              sx={{ marginBottom: 2 }}
            >
              <FormControlLabel value="Si" control={<Radio />} label="Si" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          )}
        />
      </div>
      <TextField
        type="text"
        label="Ocupación"
        fullWidth
        {...register("ocupacion")}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        type="number"
        label="Cantidad de Hijos"
        {...register("cantidadHijos")}
        fullWidth
      />
      <div style={{ marginTop: 15 }}>
        <Button type="submit" variant="contained" startIcon={<SendIcon />}>
          Actualizar Cliente
        </Button>
      </div>
    </form>
  );
};
