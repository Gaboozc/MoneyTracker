import React from "react";
import { useGlobalReducer } from "../store.jsx";
import "../styles/Historial.css"; // ✅ Import corregido siguiendo tu formato

const Historial = () => {
  const { store } = useGlobalReducer();
  const { historial, ingresos, gastos, reflexion } = store;

  const balance = ingresos - gastos;

  return (
    <section className="historial-container">
      <header className="historial-header">
        <h1>📜 Historial</h1>
        <p>Consulta tus reflexiones pasadas y resúmenes financieros</p>
      </header>

      {/* 🧘 Reflexión pasada */}
      <div className="card blue">
        <h2>🧘 Reflexión pasada</h2>
        <p className="italic">{reflexion || "Sin reflexión registrada."}</p>
      </div>

      {/* 💰 Resumen financiero */}
      <div className="card yellow">
        <h2>💰 Resumen financiero</h2>
        <ul>
          <li>Ingresos: <span className="success">${ingresos ?? 0}</span></li>
          <li>Gastos: <span className="danger">${gastos ?? 0}</span></li>
          <li>Balance: <span className={balance >= 0 ? "success" : "danger"}>${balance.toFixed(2)}</span></li>
        </ul>
      </div>

      {/* 📅 Lista de registros */}
      <div className="card green">
        <h2>📅 Registros guardados</h2>
        {historial && historial.length > 0 ? (
          <ul className="historial-lista">
            {historial.map((item, index) => (
              <li key={index}>
                <span className="fecha">{item.fecha}</span>
                <span className="detalle">{item.detalle}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay registros en el historial.</p>
        )}
      </div>
    </section>
  );
};

export default Historial;