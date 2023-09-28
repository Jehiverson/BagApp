// Importamos mi API para realizar las todas mis acciones a mi Base de datos
import axios from "./axios";
// Exportamos nuestra API para obtener los datos de mi tabla Actividad
export const obtenerActividades = () => axios.get('/actividad'); // Pasamos el path de mi API
// Exportamos nuestra API para obtener los datos de mi tabla Hijo
export const obtenerHijos = () => axios.get('/hijo'); // Pasamos el path de mi API
// Exportamos nuestra API para eliminar un dato de mi tabla Actividad
export const eliminarDato = (id) => { // Para el id por una prop
    return axios.delete(`/actividad/${id}`); // Pasamos el prop a mi path a mi API
};
// Exportamos nuestra API para ingresar un dato a mi tabla Actividad
export const actividadDatos = (formattedEvent) => { // Pasamos los datos por una prop
    return axios.post(`/actividad`, formattedEvent); // Pasamos el path de mi API y a su vez los datos de mi prop
};
// Exportamos nuestra API para actualizar el campo de pago de mi tabla actividad
export const actividadPago = (idActividad, idPago) => { // Pasamos por una prop el id y el dato a modificar
    return axios.put(`/pago/actividad/${idActividad}`, idPago) // Pasamor por el path de mi API y el id al dato a modificar y la informacion a modificar
};
// Exportamos nuestra API para modificar y mostrar los datos modificados
export const handleUpdateActivityStatus = async (idActividad, newStatusObject, actividades, setActividades) => { // Pasamos por la prop los datos a usar a mi API
    try { // Creamos un Try Catch para antierrores
        await axios.put(`/actividad/estado/${idActividad}`, newStatusObject); // Como la funcion es asyncrona colocamos un await y pasamos los datos de mi prop a modificar
        // Creamos una constante para obtener la informacion de los datos de mi tabla Actividad
        const response = await axios.get('/actividad');
        // Pasamos el dato de mi prop para obtener mi get que realice a mi API
        setActividades(response.data);
    } catch (error) { // Imprimimos el error que nos de mi API
        console.error('Error al actualizar el estado de la actividad:', error);
    }
};
// Exportamos nuestra API para modificar un dato de Actividad
export const actualizarActividad = (idActividad, values) => { // Pasamos una prop los datos a actualizar
    return axios.put(`/actividad/${idActividad}`, values) // Pasamos en mi path de mi API el campo para saber el dato a modificar y la informacion del dato nuevo
};