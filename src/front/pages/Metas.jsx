import React, { useState } from "react";
import { useGlobalReducer } from "../store.jsx";
import "../styles/Metas.css";

const Metas = () => {
  const { store, actions } = useGlobalReducer();
  const { metas } = store;

  const [nuevaMeta, setNuevaMeta] = useState("");

  // 🎯 Agregar nueva meta con objeto completo
  const handleAgregar = () => {
    const texto = nuevaMeta.trim();
    if (texto.length > 0) {
      const nueva = {
        id: Date.now(),
        texto,
        cumplida: false
      };
      actions.addMeta(nueva);
      setNuevaMeta("");
    }
  };

  const handleToggle = (id) => actions.toggleMeta(id);
  const handleEliminar = (id) => actions.deleteMeta(id);

  // 📊 Cálculo de progreso
  const total = metas.length;
  const cumplidas = metas.filter(m => m.cumplida).length;
  const progreso = total ? (cumplidas / total) * 100 : 0;

  return (
    <section className="metas-container">
      {/* 🧠 Encabezado */}
      <header className="metas-header">
        <h1>🎯 Mis Metas</h1>
        <p>Registra, sigue y completa tus objetivos</p>
      </header>

      {/* ➕ Campo nueva meta */}
      <div className="metas-add card blue">
        <input
          type="text"
          placeholder="Escribe una nueva meta"
          value={nuevaMeta}
          onChange={(e) => setNuevaMeta(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAgregar()}
        />
        <button onClick={handleAgregar}>Agregar</button>
      </div>

      {/* 📈 Barra de progreso */}
      {total > 0 && (
        <div className="metas-progreso card green">
          <h2>Progreso general</h2>
          <div className="progress">
            <div className="progress-fill" style={{ width: `${progreso}%` }} />
          </div>
          <p className="progress-text">{cumplidas} / {total} completadas</p>
        </div>
      )}

      {/* 📋 Lista de metas */}
      <div className="metas-lista card yellow">
        <h2>Lista de metas</h2>
        {total > 0 ? (
          <ul>
            {metas.map(({ id, texto, cumplida }) => (
              <li key={id} className={cumplida ? "cumplida" : ""}>
                <span>{texto || "[meta sin texto]"}</span>
                <div className="acciones">
                  <button onClick={() => handleToggle(id)}>
                    {cumplida ? "❌" : "✅"}
                  </button>
                  <button onClick={() => handleEliminar(id)}>🗑</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay metas registradas.</p>
        )}
      </div>
    </section>
  );
};

export default Metas;