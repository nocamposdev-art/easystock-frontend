import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  MenuItem,
} from '@mui/material';

function StockPage() {
  // Estado local para el formulario
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Acá más adelante conectarás con tu backend vía API REST
    console.log('Producto:', producto);
    console.log('Cantidad:', cantidad);

    alert(`Stock actualizado para "${producto}" con cantidad ${cantidad}`);

    // Reset del formulario (opcional)
    setProducto('');
    setCantidad('');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom align="center">
          Cargar / Actualizar Stock
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Simulación de productos (más adelante esto vendrá de la base de datos) */}
          <TextField
            select
            fullWidth
            label="Seleccionar Producto"
            variant="outlined"
            margin="normal"
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
          >
            <MenuItem value="Coca-Cola 500ml">Coca-Cola 500ml</MenuItem>
            <MenuItem value="Alitas BBQ">Alitas BBQ</MenuItem>
            <MenuItem value="Salchipapa Grande">Salchipapa Grande</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Cantidad"
            type="number"
            variant="outlined"
            margin="normal"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
          >
            Guardar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default StockPage;
