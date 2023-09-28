import { useRoutes, Navigate, Outlet } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import DashboardLayout from '../layouts/dashboard';
import Actividad from '../pages/Actividad';
import Cliente from '../pages/Cliente';
import Page404 from '../pages/Page404';
import Pago from '../pages/Pago';
import Home from '../pages/Home';
import Opciones from '../pages/Opciones';
import Register from '../pages/RegisterPage';
import Login from '../pages/LoginPage';
import { useAuth } from '../context/AuthContext';

export default function Router() {
  const { loading, isAuthenticated } = useAuth();

  const routes = useRoutes([
    {
      path: '/dashboard',
      element: isAuthenticated ? (
        <DashboardLayout>
          <Outlet /> {/* Renderiza las rutas anidadas dentro de DashboardLayout */}
        </DashboardLayout>
      ) : (
        <Navigate to="/" />
      ),
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
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/login',
      element: isAuthenticated ? <Navigate to="/dashboard/home" /> : <Login />,
    },
    {
      path: '*',
      element: <Page404 />,
    },
  ]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <BarLoader color="#36D7B7" loading size={150} />
      </div>
    );
  }

  return routes;
}
