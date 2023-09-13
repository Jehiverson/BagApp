import axios from "./axios";

export const registerRequest = user => axios.post(`/user/register`, user);

export const loginRequest = user => axios.post(`/user/login`, user);

export const logoutRequest = () => axios.post(`/user/logout`);

export const verityTokenRequet = () => axios.get('/user/verify');