import React from "react";
// ⬇️ Importamos el hook global desde la ruta correcta
import { useGlobalReducer } from "../store.jsx";

const CierreAnual = () => {
  // ⬇️ Extraemos el estado global (objeto, no array)
  const { store } = useGlobalReducer();

  // ⬇️ Desestructuramos los datos que necesitamos
  const { metas, reflexion, ingresos, gastos } = store;

  // ⬇️ Calculamos estadísticas
  const totalMetas = metas.length;
  const metasCumplidas = metas.filter(meta => meta.cumplida).length;
  const metasPendientes = totalMetas - metasCumplidas;
  const balance = ingresos - gastos;

  return (
    <section>
      <h1>Cierre Anual</h1>

      {/* 🎯 Sección de metas */}
      <div>
        <h2>Resumen de Metas</h2>
        <p>Total de metas: {totalMetas}</p>
        <p>Cumplidas: {metasCumplidas}</p>
        <p>Pendientes: {metasPendientes}</p>
      </div>

      {/* 🧘 Sección de reflexión */}
      <div>
        <h2>Reflexión del año</h2>
        <p>{reflexion || "No se registró ninguna reflexión."}</p>
      </div>

      {/* 💰 Sección financiera */}
      <div>
        <h2>Resumen Financiero</h2>
        <p>Ingresos: ${ingresos ?? 0}</p>
        <p>Gastos: ${gastos ?? 0}</p>
        <p>Balance final: ${balance.toFixed(2)}</p>
      </div>
    </section>
  );
};

export default CierreAnual;