import {useAuth0} from "@auth0/auth0-react";
import { Button } from '@mui/material';

const LoginButton = () => {
    const {loginWithRedirect} = useAuth0();

    return (
        <Button onClick={() => loginWithRedirect()} variant="contained" color="warning" sx={{ marginRight: 2 }}>Login</Button>
    )
}

export default LoginButton;