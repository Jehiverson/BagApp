// Importación de componentes y funciones desde MUI (Material-UI)
import { alpha, useTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

// Importación de una función de utilidad para estilos de fondo desde un archivo externo
import { bgBlur } from '../../utils/cssStyles';

// ----------------------------------------------------------------------

// Componente funcional que devuelve un conjunto de estilos globales para gráficos personalizados
export default function StyledChart() {
  // Obtención del tema actual de Material-UI
  const theme = useTheme();

  // Definición de estilos globales utilizando GlobalStyles de MUI
  const inputGlobalStyles = (
    <GlobalStyles
      styles={{
        '.apexcharts-canvas': {
          // Estilos para el tooltip
          '.apexcharts-xaxistooltip': {
            ...bgBlur({ color: theme.palette.background.default }),
            border: 0,
            color: theme.palette.text.primary,
            boxShadow: theme.customShadows.dropdown,
            borderRadius: Number(theme.shape.borderRadius) * 1.5,
            '&:before': { borderBottomColor: 'transparent' },
            '&:after': { borderBottomColor: alpha(theme.palette.background.default, 0.8) },
          },
          '.apexcharts-tooltip.apexcharts-theme-light': {
            ...bgBlur({ color: theme.palette.background.default }),
            border: 0,
            boxShadow: theme.customShadows.dropdown,
            borderRadius: Number(theme.shape.borderRadius) * 1.5,
            '.apexcharts-tooltip-title': {
              border: 0,
              textAlign: 'center',
              fontWeight: theme.typography.fontWeightBold,
              backgroundColor: alpha(theme.palette.grey[500], 0.16),
              color: theme.palette.text[theme.palette.mode === 'light' ? 'secondary' : 'primary'],
            },
          },

          // Estilos para la leyenda (legend)
          '.apexcharts-legend': {
            padding: 0,
          },
          '.apexcharts-legend-series': {
            display: 'flex !important',
            alignItems: 'center',
          },
          '.apexcharts-legend-marker': {
            marginRight: 8,
          },
          '.apexcharts-legend-text': {
            lineHeight: '18px',
            textTransform: 'capitalize',
          },
        },
      }}
    />
  );

  // Devolver los estilos globales para su uso en otros componentes
  return inputGlobalStyles;
}
