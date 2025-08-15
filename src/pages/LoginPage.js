import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 🔸 Importar el hook

function LoginPage() {
  const [nombre_user, setNombreUser] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // 🔸 Obtener la función login del contexto

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:58835/api/Usuario/login', {
        nombre: nombre_user,
        contrasena: contrasena
      });

      const { token, usuario } = response.data;
      //console.log("el nombre es", nombre_user, "contraseña:", contrasena, "id sucursal: " );

    // Guardar datos en localStorage si usás sesión o token
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('usuario', JSON.stringify(response.data.usuario));

     login(usuario); // 🟢 ACTUALIZAMOS el contexto para que diga que está conectado

      // Redirigir al dashboard u otra página
      navigate('/StockPage');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Nombre de usuario o contraseña incorrectos');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom align="center">
          Iniciar Sesión en EasyStock
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Usuario"
            variant="outlined"
            margin="normal"
            value={nombre_user}
            onChange={(e) => setNombreUser(e.target.value)}
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            variant="outlined"
            margin="normal"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;

