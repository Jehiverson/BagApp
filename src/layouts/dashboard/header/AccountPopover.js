import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import LogoutButton from '../../../components/auth/LogoutButton';
import { useAuth } from '../../../context/AuthContext';
import account from '../../../_mock/account'; // Se asume que esto es una importación de datos de cuenta ficticios.

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
];

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate(); // Obtiene la función navigate para la navegación en la aplicación.

  // Función para abrir el popover.
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  // Función para cerrar el popover.
  const handleClose = () => {
    setOpen(null);
  };

  // Obtiene información del usuario autenticado.
  const { user } = useAuth();
  const localStorageUser = JSON.parse(localStorage.getItem('user'));
  const username = localStorageUser ? localStorageUser.username : user.username;
  const email = localStorageUser ? localStorageUser.email : user.email;

  // Función para manejar la redirección al hacer clic en "Home".
  const handleHomeClick = () => {
    navigate('/dashboard/home'); // Redirige a la página de inicio.
    handleClose(); // Cierra el menú después de redirigir.
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {username}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleHomeClick}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <LogoutButton sx={{ m: 1 }} />
      </Popover>
    </>
  );
}
