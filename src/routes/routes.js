import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import Actividad from '../pages/Actividad';
import Cliente from '../pages/Cliente';
import Page404 from '../pages/Page404';
import Pago from '../pages/Pago';
import Home from '../pages/Home';
import Opciones from '../pages/Opciones';

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'home', element: <Home /> },
        { path: 'cliente', element: <Cliente /> },
        { path: 'pago', element: <Pago /> },
        { path: 'actividad', element: <Actividad /> },
        { path: 'opcion', element: <Opciones /> },
      ],
    },
    {
      path: '/',
      element: <Navigate to="/dashboard/home" />,
    },
    {
      path: '*',
      element: <Page404 />,
    },
  ]);

  return routes;
}
