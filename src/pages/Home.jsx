import React from 'react'; // Importa React
import { Helmet } from 'react-helmet-async'; // Importa Helmet para el manejo del título de la página
import { Container, Typography } from '@mui/material'; // Importa componentes de Material-UI
import HomePageCliente from '../components/Diseños/Cliente'; // Importa un componente de la página de inicio para clientes
import HomePageAdmin from '../components/Diseños/Administrador'; // Importa un componente de la página de inicio para administradores

// Definición del componente Home
export default function Home() {

  // Obtener el objeto de usuario desde localStorage
  const localStorageUser = JSON.parse(localStorage.getItem('user'));
  // Extraer el valor de 'tipoRol' del objeto de usuario
  const role = localStorageUser ? localStorageUser.tipoRol : null;
  return (
    <>
        <Helmet>
          <title>Inicio</title> {/* Cambia el título de la página */}
        </Helmet>

        <Container maxWidth="xl"> {/* Contenedor de Material-UI con ancho máximo extra grande */}
          <Typography variant="h4" sx={{ mb: 5 }}>
            ¡Hola! Bienvenido a BagApp
          </Typography>
          {/* Renderiza el componente de la página de inicio para administradores o usuarios */}
          {role === 'Administrador' || role === 'Usuario' ? (
          <div>
            <HomePageAdmin />
          </div>
          ) : null}
          {/* Renderiza el componente de la página de inicio para clientes */}
          {role === 'Cliente' ? (
            <div>
              <HomePageCliente />
            </div>
          ) : null}
        </Container>
      </>
  );
}
