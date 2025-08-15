import React from "react";
import { useGlobalReducer } from "../store.jsx";
import "../styles/Exportar.css"; // ⬅️ Importa el CSS

const Exportar = () => {
  const { store } = useGlobalReducer();
  const { metas, reflexion, ingresos, gastos } = store;

  const balance = ingresos - gastos;

  const handleExport = () => {
    console.log("Datos exportados:", store);
    alert("Datos exportados a la consola ✅");
  };

  return (
    <section className="exportar-container">
      <header className="exportar-header">
        <h1>📤 Exportar Información</h1>
        <p>Genera un volcado de tus datos para respaldos o análisis</p>
      </header>

      {/* Card principal de acción */}
      <div className="card blue">
        <h2>Acción de Exportar</h2>
        <p>Pulsa el botón para exportar toda tu información a la consola del navegador.</p>
        <button className="btn-exportar" onClick={handleExport}>
          🚀 Exportar a consola
        </button>
      </div>

      {/* Resumen rápido */}
      <div className="card green">
        <h2>📊 Resumen Actual</h2>
        <ul>
          <li>Metas registradas: <span>{metas.length}</span></li>
          <li>Reflexión: <span>{reflexion || "Sin reflexión"}</span></li>
          <li>Ingresos: <span className="success">${ingresos ?? 0}</span></li>
          <li>Gastos: <span className="danger">${gastos ?? 0}</span></li>
          <li>Balance: <span className={balance >= 0 ? "success" : "danger"}>${balance.toFixed(2)}</span></li>
        </ul>
      </div>
    </section>
  );
};

export default Exportar;