// Importamos mi API para realizar las todas mis acciones a mi Base de datos
import axios from "./axios";
// Exportamos la constante de mi API para obtener los datos de mi JOIN de mi tabla Pago y Actividad
export const pagoUnion = () => axios.get('/pago/union');
// Exportamos la constante de mi API para obtener los datos de mi tabla Pago
export const obtenerPagos = () => axios.get('/pago');
// Exportamos la constante de mi API para obtener los datos de mi JOIN de mis tablas: Pago, Actividad, Cliente y Hijo
export const datosPagos = () => axios.get('/pago/datosCombinados');
// Exportamos la constante para ingresar un dato de mi API
export const pagarDatos = (values) => { // Pasamos un prop con los datos a ingresar
    return axios.post(`/pago`, values); // Pasamos el path de mi API y el dato a ingresar
};
// Exportamos la constante para actualizar el pago de una actividad 
export const actividadPago = (idActividad, idPago) => { // Pasamos por una prop los datos a usar en mi API
    return axios.put(`/pago/actividad/${idActividad}`, idPago) // Pasamos por mi path el dato para actualizar y el cuerpo de la respuesta
};
// Exportamos la constante para actualizar la activdad de un pago
export const cambioActividadPago = (idPago, idActividad) => { // Pasamos por una prop mis datos a ingresar a mi API
    return axios.put(`/pago/cambio/${idPago}`, { idActividad }); // Envía idActividad en el cuerpo de la solicitud
};
// Exportamos la constante para actualizar un Pago
export const actualizacionPago = async (idPago, values) => { // Pasamos una prop con el numero de pago y los datos a actualizar
    try { // Hacemos un Try Catch para evitar errores
        const response = await axios.put(`/pago/actualizarpago/${idPago}`, values); // Enviamos @values en el cuerpo de la solicitud
        return response.data; // Puedes devolver los datos actualizados si es necesario
    } catch (error) {
        throw new Error('Error al actualizar el cliente'); // Lanza un error personalizado
    }
};
