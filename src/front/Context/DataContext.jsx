import React, { createContext, useState } from 'react';

// 1. Creamos el contexto para datos generales como metas, reflexiones, finanzas
export const DataContext = createContext();

// 2. Proveedor que envuelve los componentes que necesitan acceso a estos datos
export const DataProvider = ({ children }) => {
  // 3. Estado global para metas del usuario
  const [metas, setMetas] = useState([]); // Cada meta puede tener { id, titulo, cumplida }

  // 4. Estado global para reflexiones personales
  const [reflexiones, setReflexiones] = useState([]); // Cada reflexión puede tener { id, texto, fecha }

  // 5. Estado global para datos financieros
  const [finanzas, setFinanzas] = useState([]); // Ejemplo: { id, tipo, monto, fecha }

  // 6. Retornamos el proveedor con todos los valores disponibles
  return (
    <DataContext.Provider value={{
      metas,
      setMetas,
      reflexiones,
      setReflexiones,
      finanzas,
      setFinanzas
    }}>
      {children} {/* Renderiza todos los componentes hijos que estarán dentro del contexto */}
    </DataContext.Provider>
  );
};