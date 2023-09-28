import React from "react"; // Importamos la biblioteca de react mas informacion visita la documentacion en este enlace: https://es.react.dev/learn
import { useForm, Controller, useWatch, } from "react-hook-form"; // Importamos la biblioteca de react-hook-form mas informacion visita la documentacion en este enlace: https://react-hook-form.com/get-started
import { Button, TextField, Grid, RadioGroup, FormControlLabel, Radio, MenuItem, Typography, Card, CardContent } from "@mui/material"; // Importamos la biblioteca de @mui/material mas informacion visita la documentacion en este enlace: https://mui.com/components/
import SendIcon from "@mui/icons-material/Send"; // Importamos iconos de @mui/material
import { v4 as uuidv4 } from 'uuid'; // Importamos la biblioteca uuid para generar identificadores  unicos visita la documentacion en este enlace: https://github.com/uuidjs/uuid
import Select from 'react-select'; // Importamos la biblioteca de react-select mas informacion visita la documentacion en este enlace: https://react-select.com/home
import { toast } from 'react-toastify'; // Importamos la biblioteca de react-toastify mas informacion visita la documentacion en este enalce: https://github.com/fkhadra/react-toastify#readme
import 'react-toastify/dist/ReactToastify.css'; // Importamos el css de los estilos de react-toastify
import {useAuth} from "../../context/AuthContext"; // Importamos el contexto de mi Aplicacion
import { registrarCliente } from '../../api/clienteApi'; // Importamos las API que usaremos

// Creamos las opciones de mi Select
const estadosCiviles = ["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a", "Separado/a"];
// Importa varias funciones y componentes de React y bibliotecas externas.
export const FormIngresarCliente = ({closeModal}) => { // Pasamos una prop a mi componente
// Define el componente Funcional FormIngresarCliente que recibe una prop llamada closeModal.

  // Utiliza useForm para manejar el formulario y desestructura sus funciones y objetos relacionados.
  const { control, handleSubmit, register, formState: { errors } } = useForm();

  // Utiliza useAuth para gestionar la autenticación y desestructura las funciones y objetos necesarios.
  const { signup, isAuthenticated, errors: registerError } = useAuth();

  // Utiliza useWatch para observar cambios en el formulario.
  const cantidadHijos = useWatch({
    control,
    name: "cantidadHijos",
    defaultValue: 0,
  });

  // Define una función onSubmit que se ejecuta cuando se envía el formulario.
  const onSubmit = handleSubmit(async (values) => {
    try {
      // Genera un identificador único para el cliente.
      const idCliente = uuidv4();

      // Obtiene el valor seleccionado en el campo tipoRol.
      const tipoRol = values.tipoRol.value;

      // Crea un objeto clienteData que contiene todos los datos del cliente y sus hijos (inicialmente vacío).
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

      // Crea un objeto de usuario con información de autenticación.
      const user = {
        username: values.username,
        email: values.email,
        password: values.password,
        tipoRol,
        idCliente,
      }

      // Verifica si se ingresaron datos de hijos.
      if (values.children && values.children.length > 0) {
        // Si hay hijos, mapea los datos de los hijos y crea objetos para cada uno.
        clienteData.childrenData = values.children.map((child) => {
          return {
            idHijo: uuidv4(),
            idCliente,
            edad: child.fechaNacimiento,
            genero: child.genero,
          };
        });
      }

      // Envía una solicitud para registrar al cliente con sus hijos.
      await registrarCliente(clienteData);

      // Registra al usuario en el sistema.
      await signup(user);

      // Muestra una notificación de éxito.
      toast.success("Cliente e hijos ingresados");

      // Cierra el modal.
      closeModal();
    } catch (error) {
      console.log(error);
      // Muestra una notificación de error.
      toast.error("Cliente no ingresado");
    }
  }); 

  // Utiliza useWatch para observar cambios en el campo "trabajando".
  const trabajando = useWatch({
    control,
    name: "trabajando",
  });

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
        <span>Nombre del Cliente</span>
          <TextField
            type="text"
            {...register("nombreClient", {
              required: "Este campo es obligatorio",
              minLength: {
                value: 3,
                message: "El Nombre debe tener al menos 3 letras",
              },
              pattern: {
                value: /^[A-Za-z]+$/,
                message: "El Nombre solo puede contener letras",
              },
            })}
            placeholder="Nombre del Cliente"
            fullWidth
          />
          {errors.nombreClient && (
            <Typography variant="caption" color="error">
              {errors.nombreClient.message}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
        <span>Apellido del Cliente</span>
          <TextField
            type="text"
            {...register("apellidoClient", {
              required: "Este campo es obligatorio",
              minLength: {
                value: 3,
                message: "El Apellido debe tener al menos 3 letras",
              },
              pattern: {
                value: /^[A-Za-z]+$/,
                message: "El Apellido solo puede contener letras",
              },
            })}
            placeholder="Apellido del Cliente"
            fullWidth
          />
          {errors.apellidoClient && (
            <Typography variant="caption" color="error">
              {errors.apellidoClient.message}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          Fecha de Nacimiento
          <TextField
            type="date"
            {...register("fechaNacimiento", {
              required: "Este campo es obligatorio",
              validate: (value) => {
                const today = new Date();
                const birthDate = new Date(value);
                const age = today.getFullYear() - birthDate.getFullYear();

                if (Number.isNaN(age)) {
                  return "Ingresa una fecha de nacimiento válida";
                }

                if (age < 18) {
                  return "Debes ser mayor de 18 años";
                }

                return true;
              },
            })}
            fullWidth
          />
          {errors.fechaNacimiento && (
            <Typography variant="caption" color="error">
              {errors.fechaNacimiento.message}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
            <span>Direccion del Cliente</span>
          <TextField
            type="text"
            {...register("direccion", {
              pattern: {
                value: /^[A-Za-z0-9\s.,#-]+$/,
                message: "La dirección debe contener números, letras y caracteres especiales",
              },
            })}
            placeholder="Direccion del Cliente"
            fullWidth
          />
          {errors.direccion && (
            <Typography variant="caption" color="error">
              {errors.direccion.message}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
        <span>DPI del Cliente</span>
          <TextField
            type="number"
            {...register("dpi", {
              required: "Este campo es obligatorio",
              pattern: {
                value: /^[0-9]{13}$/,
                message: "El DPI debe contener exactamente 13 dígitos numéricos",
              },
              maxLength: {
                value: 13,
                message: "El DPI debe contener un máximo de 13 dígitos",
              },
            })}
            fullWidth
            placeholder="DPI"
          />
          {errors.dpi && (
            <Typography variant="caption" color="error">
              {errors.dpi.message}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
        <span>Telefono del Cliente</span>
          <TextField
            type="number"
            {...register("telefono", {
              required: "Este campo es obligatorio",
              pattern: {
                value: /^[0-9]{8}$/,
                message: "El Teléfono debe contener exactamente 8 dígitos numéricos",
              },
            })}
            placeholder="Telefono del Cliente"
            fullWidth
          />
          {errors.telefono && (
            <Typography variant="caption" color="error">
              {errors.telefono.message}
            </Typography>
          )}
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
                <div style={{display: 'flex', flexDirection: 'column', marginRight: 10}}>
                <TextField
                  type="text"
                  {...register("username", {
                    required: "Este campo es obligatorio",
                    minLength: {
                      value: 3,
                      message: "El nombre de usuario debe tener al menos 3 caracteres",
                    },
                    maxLength: {
                      value: 20,
                      message: "El nombre de usuario debe tener como máximo 20 caracteres",
                    },
                  })}
                  label="Nombre de Usuario"
                  fullWidth
                  style={{marginRight: 5, width: 300}}
                />
                {errors.username && (
                  <Typography variant="caption" color="error">
                    {errors.username.message}
                  </Typography>
                )}
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <TextField
                  type="text"
                  {...register("email", {
                    required: "Este campo es obligatorio",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "El correo electrónico no es válido",
                    },
                  })}
                  label="Correo Electronico"
                  style={{width: 315}}
                />
                {errors.email && (
                  <Typography variant="caption" color="error">
                    {errors.email.message}
                  </Typography>
                )}
                </div>
              </div>
              <div style={{display: 'flex', marginTop: 15}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <TextField
                  type="password"
                  {...register("password", {
                    required: "Este campo es obligatorio",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  })}
                  label="Contraseña"
                  style={{marginRight: 15, width: 300}}
                />
                {errors.password && (
                  <Typography variant="caption" color="error">
                    {errors.password.message}
                  </Typography>
                )}
                </div>
                 <div style={{display: 'flex', flexDirection: 'column', width: 315, marginTop: 8}}>
                 <Controller
                    name="tipoRol"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={[
                          { value: "Cliente", label: "Cliente" },
                          { value: "Usuario", label: "Usuario" },
                          { value: "Administrador", label: "Administrador" }
                        ]}
                        placeholder="Selecciona un rol"
                        menuPlacement='auto'
                        maxMenuHeight={100}
                      />
                    )}
                  />
                  {errors.tipoRol && (
                    <Typography variant="caption" color="error">
                      Este campo es obligatorio
                    </Typography>
                  )}
                 </div>
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
