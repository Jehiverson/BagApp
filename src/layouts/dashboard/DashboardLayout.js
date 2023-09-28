import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Header from './header';
import Nav from './nav';

// Altura de la barra de aplicaciones (app bar) en dispositivos móviles y de escritorio
const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

// Contenedor raíz del diseño del panel de control
const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%', // Asegura que el contenedor abarque toda la altura de la ventana
  overflow: 'hidden', // Oculta el desbordamiento de contenido
});

// Área principal de contenido del panel de control con ajustes de margen superior
const Main = styled('div')(({ theme }) => ({
  flexGrow: 1, // Ocupa todo el espacio disponible en el contenedor raíz
  overflow: 'auto', // Permite desplazamiento vertical si el contenido excede la altura
  minHeight: '100%', // Asegura que el contenido tenga al menos la altura de la ventana
  paddingTop: APP_BAR_MOBILE + 24, // Espaciado superior en dispositivos móviles
  paddingBottom: theme.spacing(10), // Espaciado inferior
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24, // Espaciado superior en dispositivos de escritorio
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// Componente principal que define el diseño del panel de control
export default function DashboardLayout() {
  // Estado para controlar la apertura y cierre del panel de navegación lateral
  const [open, setOpen] = useState(false);

  return (
    <StyledRoot>
      {/* Componente de encabezado con función para abrir el panel de navegación */}
      <Header onOpenNav={() => setOpen(true)} />
      {/* Componente de navegación lateral con estado para abrir y cerrar */}
      <Nav openNav={open} onCloseNav={() => setOpen(false)} />

      {/* Componente principal que carga rutas anidadas */}
      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  );
}
