import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Modal,
  TextField,
  Button,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function StockPage() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const rol = usuario?.rol;

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  console.log('usuario:', usuario);

  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(usuario?.sucursalId || 0);
  const [sectorSeleccionado, setSectorSeleccionado] = useState(usuario?.sector || '');

  const [openModal, setOpenModal] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState('entrada');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidadMovimiento, setCantidadMovimiento] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // pantalla <600px

  const fetchStock = async () => {
    let idSucursalConsulta = rol === 'Admin' ? sucursalSeleccionada : usuario.sucursalId;
    let sectorConsulta = rol === 'Admin' ? sectorSeleccionado : (rol === 'Superv' ? (sectorSeleccionado || usuario.sector) : usuario.sector);

    const response = await fetch(
      `http://localhost:58835/api/productos/listar?idSucursal=${idSucursalConsulta}&sector=${sectorConsulta}`
    );
    if (!response.ok) throw new Error('Error al obtener productos');
    const data = await response.json();
    setProductos(Array.isArray(data) ? data : []);
  };

  const fetchCategorias = async (sector) => {
    try {
      const url = sector
        ? `http://localhost:58835/api/productos/categoria?sector=${encodeURIComponent(sector)}`
        : `http://localhost:58835/api/productos/categoria`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al obtener categorías');
      const data = await response.json();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategorias([]);
    }
  };

  useEffect(() => {
    fetchCategorias(sectorSeleccionado);
    setCategoriaSeleccionada('');
  }, [sectorSeleccionado]);

  useEffect(() => {
    setLoading(true);
    fetchStock().catch((err) => console.error(err)).finally(() => setLoading(false));
  }, [sucursalSeleccionada, sectorSeleccionado]);

  const handleOpenModal = (producto, tipo) => {
    setProductoSeleccionado(producto);
    setTipoMovimiento(tipo);
    setCantidadMovimiento('');
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setProductoSeleccionado(null);
  };

  const handleConfirmarMovimiento = async () => {
    const cantidadNum = parseInt(cantidadMovimiento);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      alert('Ingresá una cantidad válida');
      return;
    }

    const payload = {
      codigo: productoSeleccionado.codigo,
      cantidad: cantidadNum,
      sucursalId: rol === 'Admin' ? sucursalSeleccionada : usuario.sucursalId,
      tipoMovimiento: tipoMovimiento.toLowerCase(),
      usuarioId: usuario.id
    };

    try {
      const response = await fetch('http://localhost:58835/api/stock/actualiza', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar stock: ${errorText}`);
      }

      alert('✔ Movimiento registrado correctamente.');
      setLoading(true);
      await fetchStock();
      setLoading(false);
      handleCloseModal();
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
      setLoading(false);
    }
  };

  const columnas = [
    ...(!isMobile ? [{ field: 'codigo', headerName: 'Código', flex: 1 }] : []),
    { field: 'nombre', headerName: 'Nombre', flex: 2 },
    ...(!isMobile ? [{ field: 'udm', headerName: 'UDM', flex: 1 }] : []),
   
   
    {
     field: 'cantidad',
     headerName: 'Stock',
     flex: 1,
    renderCell: (params) => {
    const stockActual = Number(params.row.cantidad);
    const stockMinimo = Number(params.row.stock_Minimo); // Asegurarse que este valor viene desde backend

    // Para depurar (solo si querés ver los valores)
    //console.log('Stock actual:', stockActual, 'Mínimo:', stockMinimo);

    let color = 'black';
    if (stockActual < stockMinimo) {
      color = 'red';
    } else if (stockActual === stockMinimo) {
      color = 'orange';
    } else {
      color = 'green';
    }

    return <strong style={{ color }}>{stockActual}</strong>;
      },
    },


    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            size="small"
            color="success"
            onClick={() => handleOpenModal(params.row, 'entrada')}
            sx={{ minWidth: 30 }}
          >
            <AddIcon fontSize="small" />
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => handleOpenModal(params.row, 'salida')}
            sx={{ minWidth: 30 }}
          >
            <RemoveIcon fontSize="small" />
          </Button>
        </Stack>
      ),
    },
  ];

  const productosFiltrados = categoriaSeleccionada
    ? productos.filter((p) => p.categoria === categoriaSeleccionada)
    : productos;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, px: { xs: 1, sm: 2, md: 4 } }}>
      <Typography variant="h5" gutterBottom>
        Inventario - Movimientos de Stock
      </Typography>

      {(rol === 'Admin' || rol === 'Superv') && (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
          {rol === 'Admin' && (
            <FormControl fullWidth>
              <InputLabel>Sucursal</InputLabel>
              <Select
                value={sucursalSeleccionada}
                label="Sucursal"
                onChange={(e) => setSucursalSeleccionada(e.target.value)}
              >
                <MenuItem value={0}>Selecciona</MenuItem>
                <MenuItem value={1}>Fernando</MenuItem>
                <MenuItem value={2}>Lambare</MenuItem>
              </Select>
            </FormControl>
          )}

          <FormControl fullWidth>
            <InputLabel>Sector</InputLabel>
            <Select
              value={sectorSeleccionado}
              label="Sector"
              onChange={(e) => setSectorSeleccionado(e.target.value)}
            >
              <MenuItem value={''}>Todos</MenuItem>
              <MenuItem value={'COCINA'}>Cocina</MenuItem>
              <MenuItem value={'BARRA'}>Barra</MenuItem>
              <MenuItem value={'CAJA'}>Caja</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={categoriaSeleccionada}
              label="Categoría"
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {categorias.map((cat) => (
                <MenuItem key={cat.codigo} value={cat.codigo}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {loading ? (
        <CircularProgress />
      ) : productosFiltrados.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No se encontraron productos para esta sucursal, sector o categoría.
        </Typography>
      ) : (
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <Box sx={{ minWidth: 600 }}>
            <DataGrid
              rows={productosFiltrados.map((p) => ({ ...p, id: p.codigo }))}
              columns={columnas}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              disableSelectionOnClick
              autoHeight
            />
          </Box>
        </Box>
      )}

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            p: 4,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            width: '90%',
            maxWidth: 400,
            mx: 'auto',
            mt: '20%',
          }}
        >
          <Typography variant="h6" gutterBottom>
            {tipoMovimiento === 'entrada' ? 'Agregar stock a' : 'Descontar stock de'} <br />
            <strong>{productoSeleccionado?.nombre}</strong>
          </Typography>

          <TextField
            fullWidth
            type="number"
            label="Cantidad"
            value={cantidadMovimiento}
            onChange={(e) => setCantidadMovimiento(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button fullWidth variant="contained" onClick={handleConfirmarMovimiento}>
              Aceptar
            </Button>
            <Button fullWidth variant="outlined" onClick={handleCloseModal}>
              Cancelar
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
}

export default StockPage;
