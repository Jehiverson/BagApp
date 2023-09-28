// Importamos mi API para realizar las todas mis acciones a mi Base de datos
import axios from "./axios";
// Exportamos la constante para obtener los datos de mi tabla Cliente
export const obtenerClientes = () => axios.get('/cliente');
// Exportamos la constante para ingresar un dato a mi tabla Cliente
export const registrarCliente = (clienteData) => { // Pasamos por una prop los datos a registrar
    return axios.post(`/cliente`, clienteData); // Hacemos el path de mi API y pasamos el registro
};
// Exportamos la constatnte para modificar el dato de mi tabla Cliente
export const actualizarCliente = async (idCliente, datosCliente) => { // Pasamos por una prop el id de mi Cliente y los datos a modificar
    try { // Hacemos un Try Catch para evitar errores
        const response = await axios.put(`/cliente/${idCliente}`, datosCliente); // Creamos la constante y pasamos los datos de mi prop
        return response.data; // Puedes devolver los datos actualizados si es necesario
    } catch (error) {
        throw new Error('Error al actualizar el cliente'); // Lanza un error personalizado
    }
};

