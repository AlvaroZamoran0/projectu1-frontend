// Navbar.js
import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Sidemenu from './Sidemenu';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { isLogin, logout } = useContext(AuthContext); // Usar el contexto
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    setOpen(open);
  };

  const handleLogout = () => {
    logout();  // Llamar a la función del contexto
    navigate('/home');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Prestabanco
          </Typography>
          {isLogin ? (
            <Button color="inherit" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/sign_in')}>
                Registrarse
              </Button>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Inicia sesión
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Sidemenu open={open} toggleDrawer={toggleDrawer} />
    </Box>
  );
}

