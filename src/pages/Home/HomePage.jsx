import React from 'react';
import { Button, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginForm() {
  const {isAuthenticated} = useAuth();
  return (
    <div>
      <AppBar position="static">
        <Toolbar style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Box sx={{ flexGrow: 1 }} />
          <div>
            {isAuthenticated ? (
              <>
              <Typography variant="h6">Logo</Typography>
              </>
            ) : (
                <>
                <Button component={Link} to="/Login" variant="contained" color="primary">
                  Login
                </Button>
                <Button component={Link} to="/Register" variant="contained" color="primary">
                  Register
                </Button>
                </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
