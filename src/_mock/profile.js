import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
    const { isAuthenticated, user } = useAuth0();
    // Verifica si el usuario está autenticado
    if (isAuthenticated) {
        // Obtiene los datos del usuario
        const userData = user;
        console.log(userData);
    }
    return(
        isAuthenticated && (
            <div>
                <img src={user.picture} alt={user.name} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
            </div>
        )
    )
}

export default Profile