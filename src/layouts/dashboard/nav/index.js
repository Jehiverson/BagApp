// Importa las dependencias necesarias.
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar } from '@mui/material';
import account from '../../../_mock/account'; // Datos ficticios de la cuenta
import useResponsive from '../../../hooks/useResponsive'; // Hook personalizado para la respuesta
import { useAuth } from '../../../context/AuthContext'; // Contexto de autenticación
import Logo from '../../../components/logo'; // Componente de logotipo
import Scrollbar from '../../../components/scrollbar'; // Componente personalizado de barra de desplazamiento
import NavSection from '../../../components/nav-section'; // Componente de sección de navegación
import navConfig from './config'; // Configuración de navegación

// Tamaños de la barra de navegación.
const NAV_WIDTH = 280;

// Estilos personalizados para la sección de cuenta.
const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// Propiedades esperadas para el componente Nav.
Nav.propTypes = {
  openNav: PropTypes.bool, // Indica si el panel de navegación está abierto.
  onCloseNav: PropTypes.func, // Función para cerrar el panel de navegación.
};

export default function Nav({ openNav, onCloseNav }) {
  // Obtiene la ubicación actual de la ruta.
  const { pathname } = useLocation();
  // Obtiene el usuario autenticado del contexto de autenticación.
  const { user } = useAuth();
  // Verifica si se está utilizando una pantalla de escritorio.
  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    // Cierra el panel de navegación si está abierto cuando cambia la ubicación.
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Obtiene información del usuario desde el almacenamiento local.
  const localStorageUser = JSON.parse(localStorage.getItem('user'));
  // Extrae el valor del rol del usuario.
  const role = localStorageUser ? localStorageUser.tipoRol : null;
  // Obtiene el nombre de usuario desde el almacenamiento local o el contexto de autenticación.
  const username = localStorageUser ? localStorageUser.username : user.username;

  // Define los módulos permitidos según el rol del usuario.
  const allowedModulesByRole = {
    Administrador: ['home', 'Clientes', 'Pagos', 'Actividades'],
    Cliente: ['home', 'Actividades'],
    Usuario: ['home', 'Clientes', 'Pagos', 'Actividades'],
  };

  // Filtra la configuración de navegación según los módulos permitidos para el rol actual.
  const filteredNavConfig = navConfig.filter((option) => {
    if (allowedModulesByRole[role]?.includes(option.title)) {
      return true;
    }
    return false;
  });

  // Contenido a renderizar en el panel de navegación.
  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar src={account.photoURL} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {username}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {role}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      {/* Componente de sección de navegación */}
      <NavSection data={filteredNavConfig} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        // Panel de navegación permanente para escritorio.
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        // Panel de navegación desplegable para dispositivos móviles.
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
