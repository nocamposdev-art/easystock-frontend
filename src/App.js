import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StockPage from './pages/StockPage';
import ReportPage from './pages/ReportPage';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import { RutaPrivada } from './components/RutaPrivada';

function App() {
  useEffect(() => {
    const hoy = new Date().toISOString().slice(0, 10);
    const fechaGuardada = localStorage.getItem('fechaModificacion');

    if (fechaGuardada !== hoy) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('userModificadosHoy_')) {
          localStorage.removeItem(key);
        }
      });
      localStorage.setItem('fechaModificacion', hoy);
    }
  }, []);


  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Rutas protegidas */}
        <Route element={<RutaPrivada />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/reporte" element={<ReportPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
