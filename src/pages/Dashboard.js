import React from 'react';
import {
  Container,
  Typography,
  Box,
  Stack,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard({ user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const rol = user?.rol;

  return (
    <Container maxWidth="lg">
      <Box textAlign="center" my={4}>
        <Typography variant="h4" gutterBottom>
          📦 EasyStock
        </Typography>
        <Typography variant="subtitle1">
          Bienvenida {user?.name || '👤'} al panel principal
        </Typography>
      </Box>

      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={3}
        justifyContent="center"
        alignItems="stretch"
      >
        <Card sx={{ flex: 1, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
          <CardActionArea onClick={() => navigate('/stock')}>
            <CardContent>
              <Typography variant="h6">Inventario</Typography>
              <Typography variant="body2">
                Gestioná el stock y actualizá productos.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ flex: 1, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
          <CardActionArea onClick={() => navigate('/reportes')}>
            <CardContent>
              <Typography variant="h6">Reportes</Typography>
              <Typography variant="body2">
                Visualizá estadísticas y exportá datos.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        {rol === 'Admin' && (
          <Card sx={{ flex: 1, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
            <CardActionArea onClick={() => navigate('/usuarios')}>
              <CardContent>
                <Typography variant="h6">Usuarios</Typography>
                <Typography variant="body2">
                  Administrá roles y accesos.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        )}
      </Stack>
    </Container>
  );
}

export default Dashboard;