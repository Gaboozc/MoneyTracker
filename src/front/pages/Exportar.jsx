import React from "react";
// ⬇️ Usamos el estado global
import { useGlobalReducer } from "../store.jsx";

const Exportar = () => {
  // ⬇️ Extraemos el store del estado global (objeto, no array)
  const { store } = useGlobalReducer();
  const { metas, reflexion, ingresos, gastos } = store;

  // ⬇️ Simulación de exportación (puedes adaptar esto a tu lógica real)
  const exportarDatos = () => {
    const datos = {
      metas,
      reflexion,
      finanzas: {
        ingresos,
        gastos,
        balance: ingresos - gastos
      }
    };

    console.log("📦 Datos exportados:", datos);
    alert("Datos exportados a consola.");
  };

  return (
    <section>
      <h1>Exportar Información</h1>
      <button onClick={exportarDatos}>Exportar a consola</button>

      {/* ✅ Vista previa */}
      <div>
        <h2>Resumen</h2>
        <p>Metas registradas: {metas.length}</p>
        <p>Reflexión: {reflexion || "Sin reflexión"}</p>
        <p>Ingresos: ${ingresos ?? 0}</p>
        <p>Gastos: ${gastos ?? 0}</p>
        <p>Balance: {(ingresos - gastos).toFixed(2)}</p>
      </div>
    </section>
  );
};

export default Exportar;