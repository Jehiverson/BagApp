// Importamos dependencias de React para mas informacion visita la documentacion este enlace: https://es.react.dev/learn
import React, { useCallback } from 'react';
// Importamos dependencias de Material UI para el diseño de la Web
// Mas informacion puedes leer la documentacion de la dependencia en este enlace: https://mui.com/components/
import { Button } from '@mui/material';
// Importamos dependencias de react-router-dom que se encarga de la navegacion del Web
// Para mas informacion visita la documentacion en este enlace: https://reactrouter.com/en/main
import { useNavigate } from 'react-router-dom';
// Importamos el Contexto de mi Aplicacion
import { useAuth } from '../../context/AuthContext';
// Creamos una la constante de mi Componente
const LogoutButton = () => {
  const { logout } = useAuth(); // Obtén la función de logout del contexto
  const navigate = useNavigate(); // Usaremos esta const para navegar en mi Web
  // Creamos la consta para mi funcion onClick y la hacemos asyncrona
  const onSubmit = useCallback(async () => {
    // Esperamos la respuesta y consultamos a mi API
    await logout(); // Llama a la función de logout
    navigate('/'); // Redirigir aquí después de cerrar sesión exitosamente
  }, [logout, navigate]);

  return (
    {/* Asignamos al boton mi evento onClick para realizar la funcion de Cerrar Sesion */},
    <Button onClick={onSubmit}>
      Logout
    </Button>
  );
};
// Exportamos mi Componente para usarla en cualquier parte de mi Aplicacion
export default LogoutButton;
