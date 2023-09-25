import axios from "./axios";

export const obtenerClientes = () => axios.get('/cliente');

export const registrarCliente = (clienteData) => {
    return axios.post(`/cliente`, clienteData);
};

export const actualizarCliente = async (idCliente, datosCliente) => {
    try {
        const response = await axios.put(`/cliente/${idCliente}`, datosCliente);
        return response.data; // Puedes devolver los datos actualizados si es necesario
    } catch (error) {
        throw new Error('Error al actualizar el cliente'); // Lanza un error personalizado
    }
};

