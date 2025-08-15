import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const RutaPrivada = () => {
  const token = localStorage.getItem('token');
   return token ? <Outlet /> : <Navigate to="/" replace />;
};