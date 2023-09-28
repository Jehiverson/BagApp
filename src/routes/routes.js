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

// Definición del componente Router
export default function Router() {
  // Obtener el estado de carga y autenticación del contexto de autenticación
  const { loading, isAuthenticated } = useAuth();

  // Definición de rutas y configuración
  const routes = useRoutes([
    {
      path: '/dashboard',
      // Verificar si el usuario está autenticado
      element: isAuthenticated ? (
        // Si está autenticado, muestra DashboardLayout con rutas anidadas
        <DashboardLayout>
          <Outlet /> {/* Renderiza las rutas anidadas dentro de DashboardLayout */}
        </DashboardLayout>
      ) : (
        // Si no está autenticado, redirige al inicio
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
      element: <Login />, // Página de inicio de sesión
    },
    {
      path: '/register',
      element: <Register />, // Página de registro
    },
    {
      path: '/login',
      element: isAuthenticated ? <Navigate to="/dashboard/home" /> : <Login />, // Redirige al dashboard si está autenticado
    },
    {
      path: '*',
      element: <Page404 />, // Página de error 404 para rutas no coincidentes
    },
  ]);

  // Si la aplicación está cargando (por ejemplo, al verificar la autenticación),
  // muestra una barra de carga
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <BarLoader color="#36D7B7" loading size={150} />
      </div>
    );
  }

  // Devuelve las rutas renderizadas
  return routes;
}
