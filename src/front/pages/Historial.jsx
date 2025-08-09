import React from "react";
import { useGlobalReducer } from "../store.jsx";

const Historial = () => {
  // ⬇️ Extraemos el store del estado global (objeto, no array)
  const { store } = useGlobalReducer();
  const { reflexion, ingresos, gastos } = store;

  // Calcula el balance
  const balance = ((ingresos ?? 0) - (gastos ?? 0)).toFixed(2);

  return (
    <section>
      <h1>Historial</h1>

      {/* 🧘 Muestra reflexión pasada */}
      <div>
        <h2>Reflexión pasada</h2>
        <p>{reflexion || "Sin reflexión registrada."}</p>
      </div>

      {/* 💰 Muestra resumen financiero */}
      <div>
        <h2>Resumen financiero</h2>
        <p>Ingresos: ${ingresos ?? 0}</p>
        <p>Gastos: ${gastos ?? 0}</p>
        <p>Balance: ${balance}</p>
      </div>
    </section>
  );
};

export default Historial;