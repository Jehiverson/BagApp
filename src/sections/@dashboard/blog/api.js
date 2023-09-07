import axios from 'axios';

export const handleUpdateActivityStatus = async (idActividad, newStatusObject, actividades, setActividades) => {
  try {
    console.log('Updating activity status with ID:', idActividad);
    console.log('Updating activity status:', idActividad, newStatusObject.estadoActividad);
    await axios.put(`http://localhost:5000/bagapp-react/us-central1/app/api/actividades/estado/${idActividad}`, newStatusObject);

    const response = await axios.get('http://localhost:5000/bagapp-react/us-central1/app/api/actividades');
    console.log('Updated activities:', response.data);
    setActividades(response.data);
  } catch (error) {
    console.error('Error al actualizar el estado de la actividad:', error);
  }
};
