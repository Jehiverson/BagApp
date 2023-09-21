import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { TextField, Button, Card } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import Fondo from '../assets/images/Fondo2.jpg';

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
      <Card style={{ padding: "20px", textAlign: "center" }}>
        <h1 style={{ fontWeight: "bold" }}>Login</h1>
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
            {...register("email", { required: true })}
            placeholder="Email"
            style={{ marginBottom: "10px" }}
          />
          {errors.email && <p style={{ color: "red" }}>Email is required</p>}
          <TextField
            type="password"
            {...register("password", { required: true })}
            placeholder="Password"
            style={{ marginBottom: "10px" }}
          />
          {errors.password && (
            <p style={{ color: "red" }}>Password is required</p>
          )}
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;
