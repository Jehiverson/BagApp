import axios from "./axios";

export const obtenerClientes = () => axios.get('/cliente');