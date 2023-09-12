import axios from "./axios";

export const obtenerActividades = () => axios.get('/actividad');