import axios from "./axios"

export const actualizarRangoEdades = (idInicio, idFin) => {
    const requestBody = {idInicio, idFin}
    return axios.put(`/rango/1`, requestBody);
};

export const cambiarActividad = (idActividadOrigen, idActividadDestino, idPago) => {
    return axios.put(`/rango/${idActividadOrigen}/${idActividadDestino}`, { idPago });
};