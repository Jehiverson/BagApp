// Importamos mi API para realizar las todas mis acciones a mi Base de datos
import axios from "./axios";
// Exportamos la constante para realizar un Registro de mi tabla User
export const registerRequest = user => axios.post(`/user/register`, user); // Pasamos el dato del usuario
// Exportamos la constante para realizar una verificacion de datos de mi API
export const loginRequest = user => axios.post(`/user/login`, user); // Pasamos los datos de mi usuario para verificarlo
// Exportamos la constante para realizar el Cierre de Sesion
export const logoutRequest = () => axios.post(`/user/logout`);
// Exportamos la constante para Validar las credenciales de mi Usuario y poder Iniciar Sesion
export const verityTokenRequet = () => axios.get('/user/verify');