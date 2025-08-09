import React, { useState } from "react";
import { useGlobalReducer } from "../store.jsx";

const Reflexion = () => {
  // ⬇️ Extraemos store y dispatch del contexto global (objeto, no array)
  const { store, dispatch } = useGlobalReducer();
  const { reflexion } = store;
  const [texto, setTexto] = useState("");

  // Guarda la reflexión en el estado global
  const guardarReflexion = () => {
    if (texto.trim()) {
      dispatch({ type: "set_reflexion", payload: texto });
      setTexto("");
    }
  };

  return (
    <section>
      <h1>Reflexión del Día</h1>

      {/* ✏ Campo de texto para escribir reflexión */}
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe tu reflexión..."
      />

      {/* 💾 Botón para guardar */}
      <button onClick={guardarReflexion}>Guardar</button>

      {/* 🧘 Muestra la última reflexión */}
      {reflexion && (
        <div>
          <h2>Última reflexión</h2>
          <p>{reflexion}</p>
        </div>
      )}
    </section>
  );
};

export default Reflexion;