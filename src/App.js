import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StockPage from './pages/StockPage';
import ReportPage from './pages/ReportPage';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import { RutaPrivada } from './components/RutaPrivada';

function App() {
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
