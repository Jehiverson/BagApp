import React, { useState } from 'react';
import { Button, AppBar, Toolbar, Typography, Container, IconButton, Drawer, List, ListItem, ListItemText, Hidden } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from "@mui/icons-material/Menu";
import LockOpenIcon from '@mui/icons-material/LockOpen'; // Icono para Login
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Icono para Register
import { useAuth } from '../../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const list = (
    <div>
      <List>
        <ListItem button component={Link} to="/Login">
          <LockOpenIcon /> {/* Icono para Login */}
          <ListItemText primary="Login" />
        </ListItem>
        <ListItem button component={Link} to="/Register">
          <PersonAddIcon /> {/* Icono para Register */}
          <ListItemText primary="Register" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Hidden mdUp>
            <IconButton
              color='inherit'
              size="large"
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Typography variant='h6' sx={{ flexGrow: 1 }}>Logo</Typography>
          <Hidden smDown>
            {isAuthenticated ? (
              <Button component={Link} to="/Login" variant="contained" color="primary">
                <LockOpenIcon /> Login
              </Button>
            ) : (
              <>
                <div style={{ justifyContent: 'left' }}>
                  <Button component={Link} to="/Login" variant="contained" color="primary" style={{ marginRight: '10px' }}>
                    <LockOpenIcon /> Login
                  </Button>
                  <Button component={Link} to="/Register" variant="contained" color="primary">
                    <PersonAddIcon /> Register
                  </Button>
                </div>
              </>
            )}
          </Hidden>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
        {list}
      </Drawer>

      <Container style={{ marginTop: '20px', textAlign: 'center' }}>
        <Typography variant="h4" style={{ marginBottom: '20px' }}>
          Bienvenido a la Página de Inicio
        </Typography>
        <Typography variant="body1" style={{ marginBottom: '40px' }}>
          Aquí puedes encontrar información interesante sobre nuestro sitio web.
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Más información
        </Button>
      </Container>
    </div>
  );
}
