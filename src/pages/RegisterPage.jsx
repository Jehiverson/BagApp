// Importación de las dependencias necesarias
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import Fondo from '../assets/images/Fondo2.jpg';

// Declaración del componente RegisterPage
function RegisterPage() {
  // Inicialización del formulario utilizando react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Utilización del contexto de autenticación
  const { signup, isAuthenticated, errors: registerError } = useAuth();

  // Utilización de la función de navegación proporcionada por react-router-dom
  const navigate = useNavigate();

  // Efecto secundario para redirigir al usuario si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  // Función para manejar la presentación del formulario
  const onSubmit = handleSubmit(async (values) => {
    signup(values); // Llama a la función de registro con los valores del formulario
    console.log(values); // Muestra los valores del formulario en la consola
  });

  // Estilo CSS para el fondo de la página
  const divStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: `url(${Fondo}) no-repeat center center fixed`,
    backgroundSize: "cover",
  };

  // Renderización del componente
  return (
    <div style={divStyle}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Card style={{ padding: "20px", textAlign: "center" }}>
          <h1 style={{ fontWeight: "bold" }}>Register</h1>
          {/* Muestra errores de registro */}
          {
            registerError.map((error, i) => (
              <div key={i} style={{ backgroundColor: "red", color: "white", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
                {error}
              </div>
            ))
          }
          <form
            onSubmit={onSubmit} // Cuando se envía el formulario, llama a la función onSubmit
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            {/* Campo de entrada para el nombre de usuario */}
            <TextField type="text" {...register("username", { required: true })} placeholder="Username" style={{ marginBottom: "10px" }} />
            {/* Muestra un mensaje de error si el campo de nombre de usuario está vacío */}
            {errors.username && <p style={{color: "red"}}>Username is required</p>}
            {/* Campo de entrada para la dirección de correo electrónico */}
            <TextField type="email" {...register("email", { required: true })} placeholder="Email" style={{ marginBottom: "10px" }} />
            {/* Muestra un mensaje de error si el campo de correo electrónico está vacío */}
            {errors.email && <p style={{color: "red"}}>Email is required</p>}
            {/* Campo de entrada para la contraseña */}
            <TextField type="password" {...register("password", { required: true })} placeholder="Password" style={{ marginBottom: "10px" }} />
            {/* Muestra un mensaje de error si el campo de contraseña está vacío */}
            {errors.password && <p style={{color: "red"}}>Password is required</p>}
            {/* Botón de registro */}
            <Button type="submit" variant="contained" color="primary">
              Register
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

// Exporta el componente RegisterPage para su uso en otras partes de la aplicación
export default RegisterPage;
