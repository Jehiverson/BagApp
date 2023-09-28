// Importamos mi API para realizar las todas mis acciones a mi Base de datos
import axios from "./axios"
// Exportamos la constante para Actualizar mi tabla de RangoEdad
export const actualizarRangoEdades = (idInicio, idFin) => { // Pasamos por una prop los datos a actualizar
    const requestBody = {idInicio, idFin} // Pasamos los datos de mi prop en una constante para asi enviarlo todo junto
    return axios.put(`/rango/1`, requestBody); // Pasamos los datos a actualizar
};
// Exportamos la constante para Cambiar de actividades de un cliente
export const cambiarActividad = (idActividadOrigen, idActividadDestino, idPago) => { // Pasamos por una prop los datos a Cambiar
    return axios.put(`/actividad/cambio/${idActividadOrigen}/${idActividadDestino}`, { idPago }); // Pasamos por el path las actividades a cambiar y el dato que se cambiara
};