import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:5000/bagapp-react/us-central1/app',
    withCredentials: true
})

export default instance;