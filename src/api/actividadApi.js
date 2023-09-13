import axios from "./axios";

export const actualizarRangoEdades = (idInicio, idFin) => {
    return axios.put(`/rango/${idInicio}/${idFin}`);
};

export const obtenerActividades = () => axios.get('/actividad');

export const cambiarActividad = (idActividadOrigen, idActividadDestino, idPago) => {
    return axios.put(`/rango/${idActividadOrigen}/${idActividadDestino}`, { idPago });
};