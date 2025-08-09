import React, { createContext, useState } from 'react';

// 1. Creamos el contexto que se usará para acceder a los datos del usuario
export const UserContext = createContext();

// 2. Creamos el proveedor que envolverá los componentes que necesitan acceso al contexto
export const UserProvider = ({ children }) => {
  // 3. Estado global del usuario, puede incluir más propiedades según lo que necesites
  const [user, setUser] = useState({
    id: null,         // ID único del usuario (puede venir de la base de datos)
    nombre: '',       // Nombre del usuario
    mood: null        // Estado emocional actual (puede usarse con MoodSelector)
  });

  // 4. Retornamos el proveedor con el valor del contexto
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children} {/* Renderiza todos los componentes hijos que estarán dentro del contexto */}
    </UserContext.Provider>
  );
};