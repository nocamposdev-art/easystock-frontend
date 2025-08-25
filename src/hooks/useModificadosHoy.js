import { useMemo } from 'react';

const obtenerClave = () => {
  const hoy = new Date().toISOString().slice(0, 10);
  return `userModificadosHoy_${hoy}`;
};

export const registrarModificacion = (codigo) => {
  const clave = obtenerClave();
  const actuales = JSON.parse(localStorage.getItem(clave) || '[]');
  const nuevos = [...new Set([...actuales, codigo])];
  localStorage.setItem(clave, JSON.stringify(nuevos));
};

export const useModificadosHoy = (productos) => {
  const clave = obtenerClave();
  const codigosModificados = JSON.parse(localStorage.getItem(clave) || '[]');

  return useMemo(() => {
    return productos.map((p) => ({
      ...p,
      modificadoHoy: codigosModificados.includes(p.codigo),
    }));
  }, [productos]);
};