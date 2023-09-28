import { Helmet } from 'react-helmet-async'; // Importa Helmet para el manejo del título de la página
import { Link as RouterLink } from 'react-router-dom'; // Importa RouterLink para crear un enlace de navegación
// @mui
import { styled } from '@mui/material/styles'; // Importa la función styled para definir estilos personalizados
import { Button, Typography, Container, Box } from '@mui/material'; // Importa componentes de Material-UI

// Define estilos personalizados para el contenido de la página
const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// Definición del componente Page404
export default function Page404() {
  return (
    <>
      <Helmet>
        <title>Not Found</title> {/* Cambia el título de la página */}
      </Helmet>

      <Container> {/* Contenedor de Material-UI */}
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}> {/* Aplica los estilos personalizados al contenido */}
          <Typography variant="h3" paragraph>
            Sorry, page not found!
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your
            spelling.
          </Typography>

          <Box
            component="img"
            src="/assets/illustrations/illustration_404.svg"
            sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
          />
          
          {/* Botón para volver a la página de inicio */}
          <Button to="/" size="large" variant="contained" component={RouterLink}>
            Go to Home
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}
