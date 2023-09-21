import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card } from "@mui/material";
import {useAuth} from "../context/AuthContext";
import Fondo from '../assets/images/Fondo2.jpg';

function RegisterPage() {
  const { register, handleSubmit, formState: {errors} } = useForm();
  const {signup, isAuthenticated, errors: registerError} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated])

  const onSubmit = handleSubmit(async (values) => {
    signup(values);
    console.log(values);
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Card style={{ padding: "20px", textAlign: "center" }}>
          <h1 style={{ fontWeight: "bold" }}>Register</h1>
          {
            registerError.map((error, i) => (
              <div key={i} style={{ backgroundColor: "red", color: "white", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
                {error}
              </div>
            ))
          }
          <form
            onSubmit={onSubmit}
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <TextField type="text" {...register("username", { required: true })} placeholder="Username" style={{ marginBottom: "10px" }} />
            {errors.username && <p style={{color: "red"}}>Username is required</p>}
            <TextField type="email" {...register("email", { required: true })} placeholder="Email" style={{ marginBottom: "10px" }} />
            {errors.email && <p style={{color: "red"}}>Email is required</p>}
            <TextField type="password" {...register("password", { required: true })} placeholder="Password" style={{ marginBottom: "10px" }} />
            {errors.password && <p style={{color: "red"}}>Password is required</p>}
            <Button type="submit" variant="contained" color="primary">
              Register
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPage;
