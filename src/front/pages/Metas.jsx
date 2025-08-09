import React, { useState } from 'react';
// ⬇️ Importamos el hook para acceder al estado global
import { useGlobalReducer } from "../store.jsx";

const Metas = () => {
  // ⬇️ Extraemos store y dispatch del contexto global (objeto, no array)
  const { store, dispatch } = useGlobalReducer();
  const { metas } = store; // ⬅️ Accedemos a la lista de metas

  // ⬇️ Estado local para manejar el input de nueva meta
  const [nuevaMeta, setNuevaMeta] = useState('');

  // ⬇️ Función para agregar una nueva meta
  const handleAdd = () => {
    if (nuevaMeta.trim()) {
      dispatch({
        type: 'add_meta', // ⬅️ Acción que agrega una meta al estado global
        payload: {
          id: Date.now(), // ⬅️ ID único basado en timestamp
          titulo: nuevaMeta, // ⬅️ Texto de la meta
          cumplida: false // ⬅️ Estado inicial: no cumplida
        }
      });
      setNuevaMeta(''); // ⬅️ Limpiamos el input
    }
  };

  // ⬇️ Función para marcar una meta como cumplida
  const handleComplete = (id) => {
    dispatch({
      type: 'complete_meta', // ⬅️ Acción que actualiza el estado de la meta
      payload: id // ⬅️ ID de la meta a completar
    });
  };

  return (
    <section>
      <h1>Mis Metas</h1>

      {/* ⬇️ Input para escribir una nueva meta */}
      <input
        type="text"
        value={nuevaMeta}
        onChange={e => setNuevaMeta(e.target.value)}
        placeholder="Escribe una nueva meta"
      />

      {/* ⬇️ Botón para agregar la meta */}
      <button onClick={handleAdd}>Agregar</button>

      {/* ⬇️ Lista de metas registradas */}
      <ul>
        {metas.map(meta => (
          <li key={meta.id}>
            {/* ⬇️ Muestra el título y estado de la meta */}
            {meta.titulo} — {meta.cumplida ? '✅' : '⏳'}

            {/* ⬇️ Botón para completar la meta si aún no está cumplida */}
            {!meta.cumplida && (
              <button onClick={() => handleComplete(meta.id)}>Completar</button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Metas;