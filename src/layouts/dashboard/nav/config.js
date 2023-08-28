// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'home',
    path: '/dashboard/home',
    icon: icon('ic_blog'),
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

export default navConfig;
