import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:5000/bagapp-5a770/us-central1/app',
    withCredentials: true
})

export default instance;