import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { TextField, Button, Card, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../context/AuthContext";
import Fondo from '../assets/images/Fondo2.jpg';
import LogoTipo from '../assets/images/LogoFinal.png';

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, errors: signinErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard/home");
  }, [isAuthenticated]);

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  const divStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: `url(${Fondo}) no-repeat center center fixed`,
    backgroundSize: "cover",
  };

  return (
    <div style={divStyle}>
      <Card style={{ padding: "20px", textAlign: "center", backgroundColor: "rgba(255, 255, 255, 0.5)", boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.2)", border: "1px solid rgba(0, 0, 0, 0.2)" }}>
        <div style={{ marginLeft: 35 }}>
          <img src={LogoTipo} alt="Logo" style={{ width: "150px", marginBottom: "20px" }} />
        </div>
        <Typography variant="h2" style={{marginBottom: 15}}>Login</Typography>
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
          onSubmit={onSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
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
          {errors.email && (
            <Typography variant="caption" color="error">
              {errors.email.message}
            </Typography>
          )}
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
          {errors.password && (
            <Typography variant="caption" color="error">
              {errors.password.message}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="secondary" startIcon={<LockOutlinedIcon />}>
            Iniciar Sesion
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;
