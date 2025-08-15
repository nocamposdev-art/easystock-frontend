import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 👉 usamos el nuevo contexto


function Navbar() {
  const navigate = useNavigate();
  //const usuario = useUsuario();
  const { usuario, logout } = useAuth(); // 👉 usamos login/logout desde contexto
  
  const handleLogout = () => {
    logout();            // Limpia localStorage y estado global
    navigate('/');       // Redirige al login
  };
  return (

    <AppBar position="static" sx={{ mb: 2 }}>
        
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          EasyStock
        </Typography>
      
        {/* Mostrar nombre del usuario */}
        <Box sx={{ mr: 2 }}>
          {usuario ? (
            <Typography variant="body1">Bienvenido, {usuario.nombre}</Typography>
          ) : (
            <Typography variant="body1">No estás logueado</Typography>
          )}
        </Box>

        {/* Botones de navegación */}
        <Box>
                {usuario && (
            <>
              <Button color="inherit" onClick={() => navigate('/stock')}>
                Stock
              </Button>

              {/* Solo los Admins ven este botón */}
              {usuario?.rol === 'Admin' && (
                <Button color="inherit" onClick={() => navigate('/reporte')}>
                  Reporte
                </Button>
              )}

              {/* Botón de cerrar sesión */}
              <Button color="inherit" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
