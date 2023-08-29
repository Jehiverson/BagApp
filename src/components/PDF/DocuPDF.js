import React from 'react';
import { Page, Document, StyleSheet, Text, View, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  pdfContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    padding: 20,
    border: '1px solid #000',
    width: '80%',
    height: '100vh',
  },
  pdfHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  pdfHeaderH1: {
    fontSize: 24,
  },
  pdfTextarea: {
    width: 300,
    height: 100,
    border: '1px solid #000',
    padding: 10,
    resize: 'none',
  },
  pdfTable: {
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    alignItems: 'center',
    height: 40,
  },
  tableCell: {
    borderRightWidth: 1,
    borderRightColor: '#000',
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'center',
  },
  tableHeader: {
    backgroundColor: '#009879',
    color: '#fff',
    fontWeight: 'bold',
  },
  tableEvenRow: {
    backgroundColor: '#f3f3f3',
  },
  tableLastRow: {
    borderBottomWidth: 2,
    borderBottomColor: '#009879',
  },
  activeRow: {
    fontWeight: 'bold',
    color: '#009879',
  },
});

const DocuPDF = () => {
  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View>
            <View style={styles.pdfContainer}>
              <View style={styles.pdfHeader}>
                <Text style={styles.pdfHeaderH1}>Reporte de Actividades Entregadas</Text>
                <View style={styles.pdfTextarea}>
                  <Text>Reporte Generado:</Text>
                  <Text>Fecha: 2023-08-01</Text>
                  <Text>hasta la fecha: 2023-08-31</Text>
                </View>
              </View>
              <View style={styles.pdfTable}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <View style={[styles.tableCell, { width: '14%' }]}>
                    <Text>N° Actividad</Text>
                  </View>
                  <View style={[styles.tableCell, { width: '14%' }]}>
                    <Text>Nombre</Text>
                  </View>
                  <View style={[styles.tableCell, { width: '18%' }]}>
                    <Text>Descripcion</Text>
                  </View>
                  <View style={[styles.tableCell, { width: '14%' }]}>
                    <Text>Fecha Entrega</Text>
                  </View>
                  <View style={[styles.tableCell, { width: '14%' }]}>
                    <Text>Estado</Text>
                  </View>
                  <View style={[styles.tableCell, { width: '14%' }]}>
                    <Text>Cliente</Text>
                  </View>
                  <View style={[styles.tableCell, { width: '14%' }]}>
                    <Text>N° Pago</Text>
                  </View>
                </View>
                {/* Aquí generas las filas de la tabla con map() */}
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default DocuPDF;
