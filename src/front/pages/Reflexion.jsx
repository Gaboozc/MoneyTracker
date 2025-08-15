import React, { useState } from "react";
import { useGlobalReducer } from "../store.jsx";
import "../styles/Reflexion.css";

const Reflexion = () => {
  const { store, actions } = useGlobalReducer();

  // Valor por defecto seguro
  const { historialReflexiones = [] } = store || {};
  const lista = Array.isArray(historialReflexiones)
    ? historialReflexiones
    : [];

  const [texto, setTexto] = useState("");

  const handleGuardar = () => {
    const limpio = texto.trim();
    if (!limpio) return;
    actions.addReflexion(limpio);
    setTexto("");
  };

  const handleBorrar = (id) => {
    actions.deleteReflexion(id);
  };

  return (
    <section className="reflexion-container">
      <header className="reflexion-header">
        <h1>🧘 Reflexión</h1>
        <p>Escribe tus pensamientos y guarda tu evolución</p>
      </header>

      <div className="card blue">
        <textarea
          placeholder="Escribe tu reflexión..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        ></textarea>
        <button type="button" onClick={handleGuardar}>
          Guardar
        </button>
      </div>

      {lista.length > 0 && (
        <div className="card green">
          <h2>📜 Historial de reflexiones</h2>
          <ul className="reflexiones-lista">
            {lista.map((ref) => (
              <li key={ref.id}>
                <div className="reflexion-item">
                  <div>
                    <span className="fecha">{ref.fecha}</span>
                    <span className="texto">{ref.texto}</span>
                  </div>
                  <button
                    className="btn-borrar"
                    onClick={() => handleBorrar(ref.id)}
                    title="Eliminar reflexión"
                  >
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default Reflexion;