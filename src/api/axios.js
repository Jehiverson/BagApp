// Importamos la dependencia para realizar peticion a otros dominios
// Para mas informacion de la dependencia puedes visitar su documentacion en este enlace: https://axios-http.com/docs/intro
import axios from "axios";
// Creamos una instancia que usaremos para crear la URL de mi API y poder recibir mis Credenciales de Inicio de Sesion
const instance = axios.create({
    baseURL: 'http://localhost:5000/bagapp-react/us-central1/app', // Nombramos mi API para realizar mis accions de mi Base de Datos
    withCredentials: true // Pedimos las credenciales de mi API
})
// Exportamos la instancia
export default instance;