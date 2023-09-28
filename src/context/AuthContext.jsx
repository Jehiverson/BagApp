import { createContext, useContext, useState, useEffect } from "react";
// Importa React y varios hooks, incluido useState y useEffect.
import Cookies from "js-cookie";
// Importa la biblioteca "js-cookie" para gestionar cookies en la aplicación.
// Mas informacion visita la documentacion en este enlace: https://github.com/js-cookie/js-cookie
import {
  registerRequest,
  loginRequest,
  verityTokenRequet,
  logoutRequest,
} from "../api/auth";
// Importamos las APIs que vamos a usar

// Crea un contexto de autenticación.
export const AuthContext = createContext();

// Define un hook personalizado para acceder al contexto de autenticación.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Componente AuthProvider que proporciona el contexto de autenticación a la aplicación.
export const AuthProvider = ({ children }) => {
  // Estados para manejar la información de autenticación.
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para registrar un nuevo usuario.
  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
      return res.data; // Devuelve el valor en caso de éxito
    } catch (error) {
      console.log(error);
      setErrors(error.response.data);
      throw error; // Lanza el error en caso de fallo
    }
  };

  // Función para iniciar sesión.
  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
      // Almacena el usuario en el localStorage.
      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data; // Devuelve el valor en caso de éxito
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        setErrors(error.response.data);
      } else {
        setErrors([error.response.data.message]);
      }
      throw error; // Lanza el error en caso de fallo
    }
  };

  // Función para eliminar el usuario del localStorage.
  const clearUserFromLocalStorage = () => {
    localStorage.removeItem("user");
  };

  // Función para cerrar sesión.
  const logout = async () => {
    try {
      await logoutRequest();
      Cookies.remove("token");
      setIsAuthenticated(false);
      setUser(null);
      clearUserFromLocalStorage();
      console.log("Sesión Cerrada");
    } catch (error) {
      console.log(error);
      setErrors(error.response.data);
      throw error;
    }
    // No es necesario un return aquí.
  };

  // Efecto para limpiar los errores después de 5 segundos.
  useEffect(() => {
    let timer;
    if (errors.length > 0) {
      timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [errors]);

  // Efecto para verificar la autenticación al cargar la aplicación.
  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();
      const localStorageUser = localStorage.getItem("user");
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        setUser(null);
        return null; // Devuelve null en este caso
      }
      if (localStorageUser) {
        // Si hay un usuario en el localStorage, úsalo.
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
        localStorage.setItem("user", JSON.stringify(res.data));

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
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        loading,
        user,
        isAuthenticated,
        errors,
        clearUserFromLocalStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
