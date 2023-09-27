import axios from "./axios";

export const pagoUnion = () => axios.get('/pago/union');

export const obtenerPagos = () => axios.get('/pago');

export const datosPagos = () => axios.get('/pago/datosCombinados');

export const pagarDatos = (values) => {
    return axios.post(`/pago`, values);
};

export const actividadPago = (idActividad, idPago) => {
    return axios.put(`/pago/actividad/${idActividad}`, idPago)
};

export const cambioActividadPago = (idPago, idActividad) => {
    return axios.put(`/pago/cambio/${idPago}`, { idActividad }); // Envía idActividad en el cuerpo de la solicitud
};

export const actualizacionPago = async (idPago, values) => {
    try {
        const response = await axios.put(`/pago/actualizarpago/${idPago}`, values);
        return response.data; // Puedes devolver los datos actualizados si es necesario
    } catch (error) {
        throw new Error('Error al actualizar el cliente'); // Lanza un error personalizado
    }
};
