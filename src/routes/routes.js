import { useRoutes } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import Actividad from '../pages/Actividad';
import Cliente from '../pages/Cliente';
import Page404 from '../pages/Page404';
import Pago from '../pages/Pago';
import Home from '../pages/Home';
import Opciones from '../pages/Opciones';
import Register from '../pages/RegisterPage';
import Login from '../pages/LoginPage';
import ProtectedRoute from '../ProtectedRoute';
import LoginForm from '../pages/Home/HomePage';

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'home', element: <ProtectedRoute><Home /></ProtectedRoute> },
        { path: 'cliente', element: <Cliente /> },
        { path: 'pago', element: <DashboardLayout><Pago /></DashboardLayout> },
        { path: 'actividad', element: <DashboardLayout><Actividad /></DashboardLayout> },
        { path: 'opcion', element: <DashboardLayout><Opciones /></DashboardLayout> },
      ],
    },
    {
      path: '/',
      element: <LoginForm />,
    },
    {
      path: '*',
      element: <Page404 />,
    },
    {
      path: '/register',
      element: <Register/>,
    },
    {
      path: '/login',
      element: <Login/>
    }
  ]);

  return routes;
}
