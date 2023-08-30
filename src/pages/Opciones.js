import React, {useState} from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Card, Slider, Button } from '@mui/material';
import axios from 'axios';
import { PDFViewer } from '@react-pdf/renderer';
import DocuPDF from '../components/PDF/DocuPDF';
import PlantillaPDF from '../components/PDF/plantillaPDF';

export default function OpcionesPage() {
  const [ageRange, setAgeRange] = React.useState([18, 65]);
  const [verPDF, setVerPdf] = useState(false);

  const handleSliderChange = (event, newValue) => {
    setAgeRange(newValue);
  };

  const handleSaveRange = () => {
    const [idInicio, idFin] = ageRange;
    const requestData = { idInicio, idFin };

    axios
      .put('http://localhost:5000/bagapp-5a770/us-central1/app/api/rango/1', requestData) // Reemplaza 'URL_DE_TU_BACKEND' por la URL correcta
      .then(response => {
        console.log('Rango de edades guardado exitosamente:', response.data);
      })
      .catch(error => {
        console.error('Error al guardar el rango de edades:', error);
      });
  };

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hola, Bienvenido a Kingo Energy
        </Typography>
        <Card sx={{ p: 3, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', backgroundColor: 'white' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Bienvenido
          </Typography>
          <Typography variant="h6">Configuración de Rango de Edades</Typography>
          <div>
            <Typography id="age-range-label">Rango de Edades</Typography>
            <Slider
              value={ageRange}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              aria-labelledby="age-range-label"
              min={0}
              max={100}
            />
          </div>
          <Button variant="contained" onClick={handleSaveRange}>
            Guardar Rango
          </Button>
        </Card>
        <br />
        <Button onClick={() => setVerPdf(!verPDF)}>
          {verPDF ? 'Ocultar PDF' : 'Ver PDF'}
        </Button>
        <div style={{ minHeight: '30vh' }}>
          {verPDF && (
            <PDFViewer style={{ width: '100%', height: '70vh' }}>
              <DocuPDF />
            </PDFViewer>
          )}
        </div>
        <PlantillaPDF />
      </Container>
    </>
  );
}
