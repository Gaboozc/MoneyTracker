import React from 'react';
import { useGlobalReducer } from "../hooks/useGlobalReducer.jsx"; // ✅ Importación nombrada

const Dashboard = () => {
  const { store } = useGlobalReducer(); // ✅ Acceso correcto al store
  const { reflexion, ingresos, gastos } = store;

  return (
    <section>
      <h1>Dashboard</h1>

      <div>
        <h2>Reflexión</h2>
        <p>{reflexion || 'No hay reflexión registrada aún.'}</p>
      </div>

      <div>
        <h2>Finanzas</h2>
        <p>Ingresos: ${ingresos ?? 0}</p>
        <p>Gastos: ${gastos ?? 0}</p>
        <p>Balance: ${((ingresos ?? 0) - (gastos ?? 0)).toFixed(2)}</p>
      </div>
    </section>
  );
};

export default Dashboard;