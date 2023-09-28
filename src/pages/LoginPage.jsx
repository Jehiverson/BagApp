// Importación de las dependencias necesarias
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { TextField, Button, Card, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../context/AuthContext";
import Fondo from '../assets/images/Fondo2.jpg';
import LogoTipo from '../assets/images/LogoFinal.png';

// Declaración del componente LoginPage
function LoginPage() {
  // Inicialización del formulario utilizando react-hook-form
  const {
    register,            // Función para registrar campos del formulario
    handleSubmit,        // Función para manejar la presentación del formulario
    formState: { errors }, // Estado para rastrear los errores del formulario
  } = useForm();

  // Utilización del contexto de autenticación
  const { signin, errors: signinErrors, isAuthenticated } = useAuth();

  // Utilización de la función de navegación proporcionada por react-router-dom
  const navigate = useNavigate();

  // Efecto secundario para redirigir al usuario si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard/home");
  }, [isAuthenticated]);

  // Función para manejar la presentación del formulario
  const onSubmit = handleSubmit((data) => {
    signin(data); // Llama a la función de inicio de sesión con los datos del formulario
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
    <>
    <div style={divStyle}>
      <Card style={{ padding: "20px", textAlign: "center", backgroundColor: "rgba(255, 255, 255, 0.5)", boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.2)", border: "1px solid rgba(0, 0, 0, 0.2)" }}>
        <div style={{ marginLeft: 35 }}>
          <img src={LogoTipo} alt="Logo" style={{ width: "150px", marginBottom: "20px" }} />
        </div>
        <Typography variant="h2" style={{marginBottom: 15}}>Login</Typography>
        {/* Muestra errores de inicio de sesión */}
        {signinErrors.map((error, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            {error}
          </div>
        ))}
        <form
          onSubmit={onSubmit} // Cuando se envía el formulario, llama a la función onSubmit
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Campo de entrada para el correo electrónico */}
          <TextField
            type="email"
            {...register("email", {
              required: "Este campo es obligatorio",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                message: "Introduce un correo electrónico válido (ejemplo@dominio.com)",
              },
            })}
            placeholder="Correo Electrónico"
            style={{ marginBottom: "10px", boxShadow: "1px 1px 15px rgba(0.1, 0.1, 0.1, 0.4)", backgroundColor: "rgba(255, 255, 255, 0.5)", borderRadius: 5 }}
          />
          {/* Muestra mensajes de error para el campo de correo electrónico */}
          {errors.email && (
            <Typography variant="caption" color="error">
              {errors.email.message}
            </Typography>
          )}
          {/* Campo de entrada para la contraseña */}
          <TextField
            type="password"
            {...register("password", {
              required: "Este campo es obligatorio",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            })}
            placeholder="Password"
            style={{ marginBottom: "10px", boxShadow: "1px 1px 15px rgba(0.1, 0.1, 0.1, 0.4)", backgroundColor: "rgba(255, 255, 255, 0.5)", borderRadius: 5}}
          />
          {/* Muestra mensajes de error para el campo de contraseña */}
          {errors.password && (
            <Typography variant="caption" color="error">
              {errors.password.message}
            </Typography>
          )}
          {/* Botón de inicio de sesión */}
          <Button type="submit" variant="contained" color="secondary" startIcon={<LockOutlinedIcon />}>
            Iniciar Sesion
          </Button>
        </form>
      </Card>
    </div>
    </>
  );
}

// Exporta el componente LoginPage para su uso en otras partes de la aplicación
export default LoginPage;
