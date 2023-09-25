import React from "react";
import { useForm, Controller, useWatch, } from "react-hook-form";
import { Button, TextField, Grid, RadioGroup, FormControlLabel, Radio, MenuItem, Typography, Card, CardContent } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useAuth} from "../../context/AuthContext";
import { registrarCliente } from '../../api/clienteApi';


const estadosCiviles = ["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a", "Separado/a"];

export const FormIngresarCliente = ({closeModal}) => {
  const { control, handleSubmit, register } = useForm();
  const {signup, isAuthenticated, errors: registerError} = useAuth();

  const cantidadHijos = useWatch({
    control,
    name: "cantidadHijos",
    defaultValue: 0,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const idCliente = Math.floor(Math.random() * 1000);
      const tipoRol = "Cliente";
      // Crear un objeto que contiene todos los datos del cliente y los hijos
      const clienteData = {
        idCliente,
        nombreClient: values.nombreClient,
        apellidoClient: values.apellidoClient,
        fechaNacimiento: values.fechaNacimiento,
        dpi: values.dpi,
        genero: values.genero,
        estadoCivil: values.estadoCivil,
        trabajando: values.trabajando,
        ocupacion: values.ocupacion,
        telefono: values.telefono,
        direccion: values.direccion,
        cantidadHijos: values.cantidadHijos,
        childrenData: [], // Inicialmente, el array de datos de los hijos está vacío
      };

      const registro = {
        username: values.username,
        email: values.email,
        password: values.password,
        tipoRol,
        idCliente,
      }
  
      // Verificar si hay hijos para registrar
      if (values.children && values.children.length > 0) {
        clienteData.childrenData = values.children.map((child) => {
          return {
            idHijo: Math.floor(Math.random() * 1000),
            idCliente,
            edad: child.fechaNacimiento,
            genero: child.genero,
          };
        });
      }
  
      console.log("Cliente y hijos:", clienteData);
  
      // Enviar la solicitud para registrar al cliente con sus hijos
      await registrarCliente(clienteData);
      await signup(registro);
      toast.success("Cliente e hijos ingresados");
      closeModal();
    } catch (error) {
      console.log(error);
      toast.error("Cliente no ingresado");
    }
  });  

  const trabajando = useWatch({
    control,
    name: "trabajando",
  });

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            type="text"
            {...register("nombreClient")}
            label="Nombre del Cliente"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="text"
            {...register("apellidoClient")}
            label="Apellido del Cliente"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          Fecha de Nacimiento
          <TextField
            type="date"
            {...register("fechaNacimiento")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
            <span>Direccion del Cliente</span>
          <TextField
            type="text"
            {...register("direccion")}
            label="Direccion del Cliente"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="number"
            {...register("dpi")}
            fullWidth
            label="DPI"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="number"
            {...register("telefono")}
            label="Telefono del Cliente"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
        </Grid>
        <Grid item xs={12} sm={6}>
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
        </Grid>
        <Grid item xs={12} sm={6}>
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
        </Grid>
        {trabajando === "Si" && (
          <Grid item xs={12} sm={6}>
            <Controller
              name="ocupacion"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  type="text"
                  label="Ocupación"
                  fullWidth
                  {...field}
                />
              )}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={12}>
          <TextField
            type="number"
            label="Cantidad de Hijos"
            {...register("cantidadHijos")}
            fullWidth
          />
        </Grid>
        {Array.from({ length: cantidadHijos }).map((_, index) => (
          <Grid item xs={12} sm={12} key={index}>
            <Typography variant="h6" gutterBottom>
              Datos del Hijo {index + 1}
            </Typography>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <h5 style={{ margin: "0", marginRight: "16px" }}>Género:</h5>
              <Controller
                name={`children[${index}].genero`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RadioGroup
                    aria-label={`Género del Hijo ${index + 1}`}
                    {...field}
                    row
                    sx={{ marginBottom: 2 }}
                  >
                    <FormControlLabel value="Mujer" control={<Radio />} label="M" />
                    <FormControlLabel value="Hombre" control={<Radio />} label="H" />
                  </RadioGroup>
                )}
              />
            </div>
            <TextField
              type="date"
              label={`Fecha de Nacimiento del Hijo ${index + 1}`}
              {...register(`children[${index}].fechaNacimiento`, { required: true })}
              fullWidth
              sx={{ marginBottom: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        ))}
      </Grid>
      <Grid item xs={12} md={3} style={{marginTop: 15}}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Registro de Usuario</Typography>
              <div style={{display: 'flex'}}>
                <TextField
                  type="text"
                  {...register("username")}
                  label="Nombre de Usuario"
                  fullWidth
                  style={{marginRight: 15}}
                />
                <TextField
                  type="text"
                  {...register("email")}
                  label="Correo Electronico"
                  fullWidth
                />
              </div>
              <div style={{display: 'flex', marginTop: 15}}>
                <TextField
                  type="number"
                  {...register("password")}
                  label="Contraseña"
                  fullWidth
                  style={{marginRight: 15}}
                />
              </div>
            </CardContent>
          </Card>
        </Grid>
      <div style={{ marginTop: 15 }}>
        <Button type="submit" variant="contained" startIcon={<SendIcon />}>
          Enviar
        </Button>
      </div>
    </form>
  );
};
