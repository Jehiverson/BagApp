import axios from "./axios";

export const obtenerPagos = () => axios.get('/pago');

export const pagarDatos = (values) => {
    return axios.post(`/pago`, values);
};

export const actividadPago = (idActividad, idPago) => {
    return axios.put(`/pago/actividad/${idActividad}`, idPago)
}