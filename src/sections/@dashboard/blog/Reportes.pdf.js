import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { format } from 'date-fns-tz';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './pdf/logo_pdf.png';
import { datosPagos } from '../../../api/pagoApi';

// Función para calcular la edad a partir de la fecha de nacimiento
function calcularEdad(fechaNacimiento) {
  const fechaNacimientoDate = new Date(fechaNacimiento);
  const fechaActual = new Date();
  const diff = fechaActual - fechaNacimientoDate;
  const edad = new Date(diff);
  return Math.abs(edad.getUTCFullYear() - 1970);
}

// Componente ReportePDF
const ReportePDF = ({ idActividad }) => {
  // Estado para almacenar los datos de la actividad
  const [actividad, setActividad] = useState([]);
  
  // Obtener el usuario actual del almacenamiento local
  const localStorageUser = JSON.parse(localStorage.getItem('user'));
  const username = localStorageUser ? localStorageUser.username : null;

  // Función para obtener los datos de la actividad
  const obtenerActividad = async () => {
    try {
      const response = await datosPagos();

      if (Array.isArray(response.data)) {
        // Filtrar los registros por 'idActividad' que coincida con alguno en 'idActividad'
        const registrosFiltrados = response.data.filter((registro) => idActividad.includes(registro.idActividad));
        setActividad(registrosFiltrados);
      } else {
        console.log('No se encontraron registros válidos');
        setActividad([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Efecto para cargar los datos de la actividad
  useEffect(() => {
    obtenerActividad();
  }, [idActividad]);

  // Función para obtener el título del documento PDF
  const getTitle = () => 'BANCO DE ALIMENTOS DE GUATEMALA - BASE DE DATOS DE BENEFICIARIOS';

  // Función para obtener el título del informe con detalles de la actividad
  const getTitulo = () => {
    let nombreActividad = '';
    let fechaEntrega = '';
    let lugarActividad = '';

    if (actividad.length > 0) {
      const primeraActividad = actividad[0].actividad;

      if (primeraActividad) {
        nombreActividad = primeraActividad.nombreActividad;
        lugarActividad = primeraActividad.lugarActividad;

        // Obtener la fecha de entrega en formato UTC
        const fechaEntregaUTC = new Date(primeraActividad.fechaEntrega);

        // Definir la zona horaria de América Central
        const zonaHorariaAmericaCentral = 'America/Guatemala';

        // Formatear la fecha a la zona horaria de América Central (solo fecha y hora)
        fechaEntrega = format(fechaEntregaUTC, 'yyyy-MM-dd', { timeZone: zonaHorariaAmericaCentral });
      }
    }

    const nombreOrganizacion = `Nombre de la Actividad: ${nombreActividad}`;
    const lugarEntrega = `Lugar de entrega: ${lugarActividad}`;
    const responsabilidadProyecto = `PDF Generado por: ${username}`;

    return `${nombreOrganizacion}          Fecha entrega: ${fechaEntrega}         ${lugarEntrega}          ${responsabilidadProyecto}`;
  };

  // Función para manejar la generación del PDF
  const handleGeneratePDF = () => {
    console.log(actividad);
    try {
      const doc = new jsPDF('landscape');

      // Marca de agua
      const watermarkWidth = 50;
      const watermarkHeight = 20;
      const watermarkX = 10;
      const watermarkY = 10;
      doc.addImage(logo, 'PNG', watermarkX, watermarkY, watermarkWidth, watermarkHeight, null, 'FAST');

      // Calcular la posición central de los títulos
      const centerX = doc.internal.pageSize.width / 2;

      // Añadir título centrado y en negrita
      const title = getTitle();
      const titleFontSize = 12;
      doc.setFontSize(titleFontSize);
      doc.setTextColor(0);
      doc.setFont('helvetica', 'bold');
      doc.text(centerX, watermarkY + watermarkHeight + 5, title, 'center');

      // Añadir subtitulo centrado
      const titulo = getTitulo();
      const tituloFontSize = 8;
      doc.setFontSize(tituloFontSize);
      doc.setFont('helvetica', 'normal');
      doc.text(centerX, watermarkY + watermarkHeight + 15, titulo, 'center');

      const currentDate = new Date();

      const tableHeaders = [
        [
          { content: 'No', rowSpan: 3 },
          { content: 'CODIGO', rowSpan: 3 },
          { content: 'Nombre completo del representante de la familia\n(Nombres, Apellido)', rowSpan: 3 },
          { content: 'Numero de DPI', rowSpan: 3 },
          { content: 'Telefono', rowSpan: 3 },
          { content: 'Genero\n(F,M)', rowSpan: 3 },
          { content: 'Edad\n(años)', rowSpan: 3 },
          { content: 'Estado Civil\n(S,C,U,D,otro)', rowSpan: 3 },
          { content: 'Ocupacion', rowSpan: 3 },
          { content: 'Trabaja actualmente\n(Si,No)', rowSpan: 3 },
          { content: 'Numero de Beneficiarios', colSpan: 10 },
          { content: 'TOTAL MIEMBROS DE LA FAMILIA', rowSpan: 3 },
          { content: 'Direccion', rowSpan: 3 },
        ],
        [
          { content: '0-2 años', colSpan: 2 },
          { content: '3 a 5 años', colSpan: 2 },
          { content: '6 a 18 años', colSpan: 2 },
          { content: '19 a 49 años', colSpan: 2 },
          { content: 'Mayor 50 años', colSpan: 2 },
          '',
          '',
          '',
          '',
          '',
        ],
        [
          'H',
          'M',
          'H',
          'M',
          'H',
          'M',
          'H',
          'M',
          'H',
          'M',
          '',
          '',
          '',
          '',
        ],
      ];

      let autoIncrement = 0;

      const tableData = Array.isArray(actividad)
        ? actividad.map((actividad) => {
            const clienteInfo = actividad.cliente;
            autoIncrement += 1;
            if (clienteInfo) {
              const birthDate = new Date(clienteInfo.fechaNacimiento);
              const age = currentDate.getFullYear() - birthDate.getFullYear();
              const formattedAge = Number.isNaN(age) ? '' : age.toString();

              const clienteHijos = clienteInfo.hijos || [];
              // Inicializa contadores para cada categoría
              const categorias = {
                '0-2 años Hombre': 0,
                '0-2 años Mujer': 0,
                '3-5 años Hombre': 0,
                '3-5 años Mujer': 0,
                '6-18 años Hombre': 0,
                '6-18 años Mujer': 0,
                '19-49 años Hombre': 0,
                '19-49 años Mujer': 0,
                '50+ años Hombre': 0,
                '50+ años Mujer': 0,
              };
              // Recorre los hijos del cliente y actualiza las categorías
              clienteHijos.forEach((hijo) => {
                const edadHijo = calcularEdad(hijo.edad);
                const generoHijo = hijo.genero;

                if (edadHijo >= 0 && edadHijo <= 2) {
                  categorias[generoHijo === 'Hombre' ? '0-2 años Hombre' : '0-2 años Mujer'] += 1;
                } else if (edadHijo >= 3 && edadHijo <= 5) {
                  categorias[generoHijo === 'Hombre' ? '3-5 años Hombre' : '3-5 años Mujer'] += 1;
                } else if (edadHijo >= 6 && edadHijo <= 18) {
                  categorias[generoHijo === 'Hombre' ? '6-18 años Hombre' : '6-18 años Mujer'] += 1;
                } else if (edadHijo >= 19 && edadHijo <= 49) {
                  categorias[generoHijo === 'Hombre' ? '19-49 años Hombre' : '19-49 años Mujer'] += 1;
                } else {
                  categorias[generoHijo === 'Hombre' ? '50+ años Hombre' : '50+ años Mujer'] += 1;
                }
              });

              return [
                autoIncrement,
                actividad.idCliente,
                `${clienteInfo.nombreClient} ${clienteInfo.apellidoClient}`,
                clienteInfo.dpi,
                clienteInfo.telefono,
                clienteInfo.genero,
                formattedAge,
                clienteInfo.estadoCivil,
                clienteInfo.ocupacion,
                clienteInfo.trabajando,
                categorias['0-2 años Hombre'],
                categorias['0-2 años Mujer'],
                categorias['3-5 años Hombre'],
                categorias['3-5 años Mujer'],
                categorias['6-18 años Hombre'],
                categorias['6-18 años Mujer'],
                categorias['19-49 años Hombre'],
                categorias['19-49 años Mujer'],
                categorias['50+ años Hombre'],
                categorias['50+ años Mujer'],
                clienteInfo.cantidadHijos,
                clienteInfo.direccion,
              ];
            }
            // Devuelve un valor vacío o null, según tus necesidades
            return null;
          })
        : [];

      const tableOptions = {
        margin: { top: watermarkY + watermarkHeight + 30 },
        styles: {
          fontSize: 6, // Cambiar el tamaño de fuente a 6
          cellPadding: 2,
        },
        theme: 'grid',
        headStyles: {
          fontSize: 6, // Cambiar el tamaño de fuente a 6
          fillColor: [51, 153, 102],
          textColor: [255, 255, 255],
          halign: 'center',
          valign: 'middle',
        },
      };

      doc.autoTable({
        head: [tableHeaders[0], tableHeaders[1], tableHeaders[2]],
        body: tableData,
        ...tableOptions,
      });

      // Manejo del conteo de páginas
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i += 1) {
        doc.setPage(i);

        // Calcula la posición X para la esquina superior derecha
        const pageWidth = doc.internal.pageSize.width;
        const positionX = pageWidth - 30; // Ajusta el valor "40" para alejarlo más a la derecha

        doc.text(positionX, 10, `Página ${i} de ${totalPages}`);
      }

      // Guardar el PDF con un nombre específico
      doc.save('reporte_actividades.pdf');
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  return (
    <div>
      {/* Botón para generar el PDF */}
      <Button variant="contained" color="secondary" size="small" startIcon={<CloudDownloadOutlinedIcon />} sx={{ mt: 2 }} onClick={handleGeneratePDF}>
        Generar PDF
      </Button>
    </div>
  );
};

export default ReportePDF;
