import React from "react";
import { useGlobalReducer } from "../store.jsx";
import "../styles/ResumenAnual.css";  // ⬅️ Importa los estilos

const ResumenAnual = () => {
  const { store } = useGlobalReducer();
  const { metas, reflexion, ingresos, gastos } = store;

  const totalMetas = metas.length;
  const metasCumplidas = metas.filter(meta => meta.cumplida).length;
  const metasPendientes = totalMetas - metasCumplidas;
  const balance = ingresos - gastos;
  const progreso = totalMetas > 0 ? (metasCumplidas / totalMetas) * 100 : 0;

  return (
    <section className="resumen-anual-container">
      <header className="resumen-header">
        <h1>📅 Resumen Anual</h1>
        <p>Tu snapshot del año: logros, reflexiones y finanzas</p>
      </header>

      <div className="card green">
        <h2>🎯 Resumen de Metas</h2>
        <ul>
          <li>Total de metas: <span>{totalMetas}</span></li>
          <li>Cumplidas: <span className="success">{metasCumplidas}</span></li>
          <li>Pendientes: <span className="danger">{metasPendientes}</span></li>
        </ul>
        <div className="progress">
          <div className="progress-fill" style={{ width: `${progreso}%` }}></div>
        </div>
        <p className="progress-text">{progreso.toFixed(0)}% completadas</p>
      </div>

      <div className="card blue">
        <h2>🧘 Reflexión del Año</h2>
        <p className="italic">{reflexion || "No se registró ninguna reflexión."}</p>
      </div>

      <div className="card yellow">
        <h2>💰 Resumen Financiero</h2>
        <ul>
          <li>Ingresos: <span className="success">${ingresos ?? 0}</span></li>
          <li>Gastos: <span className="danger">${gastos ?? 0}</span></li>
          <li>Balance final: <span className={balance >= 0 ? "success" : "danger"}>${balance.toFixed(2)}</span></li>
        </ul>
      </div>
    </section>
  );
};

export default ResumenAnual;