import React from 'react';
import { Button, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function LoginForm() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Typography variant="h6">Logo</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <div>
            <Button component={Link} to="/Login" variant="contained" color="primary">
              Login
            </Button>
            <Button component={Link} to="/Register" variant="contained" color="primary">
              Register
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
