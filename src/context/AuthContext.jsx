import {createContext, useContext, useState, useEffect} from "react";
import Cookies from "js-cookie";
import { registerRequest, loginRequest, verityTokenRequet, logoutRequest } from "../api/auth";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const signup = async (user) => {
        try {
            const res = await registerRequest(user);
            setUser(res.data);
            setIsAuthenticated(true);
            return res.data; // Devuelve el valor en caso de éxito
        } catch (error) {
            console.log(error)
            setErrors(error.response.data);
            throw error; // Lanza el error en caso de fallo
        }
    }    

    const signin = async (user) => {
        try {
            const res = await loginRequest(user);
            setUser(res.data);
            setIsAuthenticated(true);
            // Almacena el usuario en el localStorage
            localStorage.setItem('user', JSON.stringify(res.data));
            return res.data; // Devuelve el valor en caso de éxito
        } catch(error) {
            if (Array.isArray(error.response.data)) {
                setErrors(error.response.data);
            } else {
                setErrors([error.response.data.message]);
            }
            throw error; // Lanza el error en caso de fallo
        }
    }    

    const clearUserFromLocalStorage = () => {
        // Elimina el usuario del localStorage
        localStorage.removeItem('user');
    }

    const logout = async () => {
        try {
            await logoutRequest();
            Cookies.remove("token");
            setIsAuthenticated(false);
            setUser(null);
            clearUserFromLocalStorage();
            console.log('Sesión Cerrada');
        } catch (error) {
            console.log(error)
            setErrors(error.response.data);
            throw error;
        }
        // No es necesario un return aquí
    }
    
    useEffect(() => {
        let timer;
        if (errors.length > 0) {
            timer = setTimeout(() => {
                setErrors([])
            }, 5000)
        }
        return () => clearTimeout(timer);
    }, [errors]);    

    useEffect(() => {
        const checkLogin = async () => {
            const cookies = Cookies.get();
            const localStorageUser = localStorage.getItem('user');
            if (!cookies.token) {
                setIsAuthenticated(false);
                setLoading(false);
                setUser(null);
                return null; // Devuelve null en este caso
            }
            if (localStorageUser) {
                // Si hay un usuario en el localStorage, úsalo
                setUser(JSON.parse(localStorageUser));
                setIsAuthenticated(true);
                setLoading(false);
                return null;
            }
            try {
                const res = await verityTokenRequet(cookies.token);
                if (!res.data) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return null; // Devuelve null en este caso
                }
                localStorage.setItem('user', JSON.stringify(res.data));
        
                setIsAuthenticated(true);
                setUser(res.data);
                setLoading(false);
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                Cookies.remove("token");
                throw error;
            }
            return null; // Devuelve null al final para manejar el flujo completo
        }               
        
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider value={{
            signup,
            signin,
            logout,
            loading,
            user,
            isAuthenticated,
            errors,
            clearUserFromLocalStorage,
        }}>
            {children}
        </AuthContext.Provider>
    )
}
