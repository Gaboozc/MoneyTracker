// src/front/hooks/useGlobalReducer.jsx

import { createContext, useContext, useReducer } from "react";

// Estado inicial con todos los datos que usará la app
export const initialStore = () => ({
  message: null,
  todos: [
    { id: 1, title: "Make the bed", background: null },
    { id: 2, title: "Do my homework", background: null }
  ],
  metas: [],
  reflexion: null,
  ingresos: 0,
  gastos: 0
});

// Reducer principal (única exportación default)
const storeReducer = (store, action = {}) => {
  switch (action.type) {
    case "set_hello":
      return { ...store, message: action.payload };

    case "add_task":
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map(todo =>
          todo.id === id ? { ...todo, background: color } : todo
        )
      };

    case "add_meta":
      return { ...store, metas: [...store.metas, action.payload] };

    case "complete_meta":
      return {
        ...store,
        metas: store.metas.map(meta =>
          meta.id === action.payload ? { ...meta, cumplida: true } : meta
        )
      };

    case "delete_meta":
      return {
        ...store,
        metas: store.metas.filter(meta => meta.id !== action.payload)
      };

    case "set_reflexion":
      return { ...store, reflexion: action.payload };

    case "set_ingresos":
      return { ...store, ingresos: action.payload };

    case "set_gastos":
      return { ...store, gastos: action.payload };

    // En lugar de lanzar, devolvemos el estado actual
    default:
      return store;
  }
};

export default storeReducer;

// Contexto global
const StoreContext = createContext();

// Provider que envuelve la app
export const StoreProvider = ({ children }) => {
  const [store, dispatch] = useReducer(storeReducer, initialStore());
  return (
    <StoreContext.Provider value={{ store, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

// Hook personalizado (exportación nombrada)
export function useGlobalReducer() {
  const { store, dispatch } = useContext(StoreContext);
  return { store, dispatch };
}