// LogoutButton.js
import React, { useCallback } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LogoutButton = () => {
  const { logout } = useAuth(); // Obtén la función de logout del contexto
  const navigate = useNavigate();

  const onSubmit = useCallback(async () => {
    await logout(); // Llama a la función de logout
    navigate('/'); // Redirigir aquí después de cerrar sesión exitosamente
  }, [logout, navigate]);

  return (
    <Button onClick={onSubmit}>
      Logout
    </Button>
  );
};

export default LogoutButton;
