import axios from "./axios";

export const obtenerActividades = () => axios.get('/actividad');

export const obtenerHijos = () => axios.get('/hijo');

export const eliminarDato = (id) => {
    return axios.delete(`/actividad/${id}`);
};

export const actividadDatos = (formattedEvent) => {
    return axios.post(`/actividad`, formattedEvent);
};

export const actividadPago = (idActividad, idPago) => {
    return axios.put(`/pago/actividad/${idActividad}`, idPago)
};

export const handleUpdateActivityStatus = async (idActividad, newStatusObject, actividades, setActividades) => {
    try {
        console.log('Updating activity status with ID:', idActividad);
        console.log('Updating activity status:', idActividad, newStatusObject.estadoActividad);
        await axios.put(`/actividad/estado/${idActividad}`, newStatusObject);

        const response = await axios.get('/actividad');
        console.log('Updated activities:', response.data);
        setActividades(response.data);
    } catch (error) {
        console.error('Error al actualizar el estado de la actividad:', error);
    }
};

export const actualizarActividad = (idActividad, values) => {
    return axios.put(`/actividad/${idActividad}`, values)
};