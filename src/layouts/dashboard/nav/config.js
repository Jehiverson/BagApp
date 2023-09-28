// Importa el componente SvgColor utilizado para mostrar íconos SVG con colores personalizados.
import SvgColor from '../../../components/svg-color';

// Define una función de utilidad para crear elementos SvgColor a partir del nombre del ícono.
const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

// Configuración de navegación: una matriz de objetos que representan elementos del menú.
const navConfig = [
  {
    title: 'home', // Título del elemento de menú.
    path: '/dashboard/home', // Ruta de navegación asociada.
    icon: icon('ic_blog'), // Ícono del elemento de menú generado con la función 'icon'.
  },
  {
    title: 'Clientes',
    path: '/dashboard/cliente',
    icon: icon('ic_user'),
  },
  {
    title: 'Pagos',
    path: '/dashboard/pago',
    icon: icon('ic_cart'),
  },
  {
    title: 'Actividades',
    path: '/dashboard/actividad',
    icon: icon('ic_blog'),
  },
  {
    title: 'Opciones',
    path: '/dashboard/opcion',
    icon: icon('ic_lock'),
  }
];

export default navConfig; // Exporta la configuración de navegación para su uso en otros componentes.
