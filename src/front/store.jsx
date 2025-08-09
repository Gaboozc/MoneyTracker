// ✅ Estado inicial con todos los datos que usará la app
export const initialStore = () => {
  return {
    message: null,        // Mensaje de prueba
    todos: [              // Lista de tareas
      { id: 1, title: "Make the bed", background: null },
      { id: 2, title: "Do my homework", background: null }
    ],
    metas: [],            // 🎯 Lista de metas del usuario
    reflexion: null,      // 🧘 Reflexión del día
    ingresos: 0,          // 💰 Total de ingresos
    gastos: 0             // 💸 Total de gastos
  };
};

// ✅ Reducer que gestiona las acciones sobre el estado global
export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_hello':
      return { ...store, message: action.payload };

    case 'add_task':
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map(todo =>
          todo.id === id ? { ...todo, background: color } : todo
        )
      };

    // 🎯 Metas
    case 'add_meta':
      return { ...store, metas: [...store.metas, action.payload] };

    case 'complete_meta':
      return {
        ...store,
        metas: store.metas.map(meta =>
          meta.id === action.payload ? { ...meta, cumplida: true } : meta
        )
      };

    case 'delete_meta':
      return {
        ...store,
        metas: store.metas.filter(meta => meta.id !== action.payload)
      };

    // 🧘 Reflexión
    case 'set_reflexion':
      return { ...store, reflexion: action.payload };

    // 💰 Finanzas
    case 'set_ingresos':
      return { ...store, ingresos: action.payload };

    case 'set_gastos':
      return { ...store, gastos: action.payload };

    default:
      throw Error('Unknown action.');
  }
}

// ✅ Contexto global para compartir el estado en toda la app
import React, { createContext, useContext, useReducer } from 'react';

const StoreContext = createContext();

// 🛡 Provider que envuelve la app y comparte el estado
export const GlobalProvider = ({ children }) => {
  const [store, dispatch] = useReducer(storeReducer, initialStore());

  // ⬅️ Devolvemos un OBJETO, no un array
  return (
    <StoreContext.Provider value={{ store, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

// 🪝 Hook para acceder al estado global
export const useGlobalReducer = () => useContext(StoreContext);