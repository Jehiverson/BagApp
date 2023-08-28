// PublicRoute.js
import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';

const PublicRoute = ({ element, isAuthenticated, ...rest }) => {
  console.log('PublicRoute: Verificando autenticación...');
  if (isAuthenticated) {
    console.log('PublicRoute: Autenticado, redirigiendo a /dashboard');
    return <Navigate to="/dashboard" />;
  }

  return (
    <Routes>
      <Route {...rest} element={element} />
    </Routes>
  );
};

export default PublicRoute;
