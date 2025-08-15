// -------------------------------
// Estado inicial con persistencia y merge seguro
// -------------------------------
export const initialStore = () => {
  const defaultState = {
    message: null,
    todos: [
      { id: 1, title: "Make the bed", background: null },
      { id: 2, title: "Do my homework", background: null }
    ],
    metas: [],
    reflexion: null,
    historialReflexiones: [], // 🆕 siempre como array
    ingresos: 0,
    gastos: 0,
    // Mantén aquí cualquier otra propiedad original que uses
  };

  const saved = localStorage.getItem("globalStore");
  if (!saved) return defaultState;

  try {
    const parsed = JSON.parse(saved) || {};
    return {
      ...defaultState,
      ...parsed,
      historialReflexiones: Array.isArray(parsed.historialReflexiones)
        ? parsed.historialReflexiones
        : []
    };
  } catch (e) {
    console.error(e);
    return defaultState;
  }
};

// -------------------------------
// Reducer principal
// -------------------------------
export default function storeReducer(store, action = {}) {
  switch (action.type) {
    // ==== Acciones originales ====
    case "set_message":
      return { ...store, message: action.payload };

    case "add_todo":
      return { ...store, todos: [...store.todos, action.payload] };

    case "update_todo":
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === action.payload.id ? { ...todo, ...action.payload } : todo
        )
      };

    case "delete_todo":
      return {
        ...store,
        todos: store.todos.filter((todo) => todo.id !== action.payload)
      };

    // ==== Metas ====
    case "set_metas":
      return { ...store, metas: action.payload };

    case "add_meta":
      return { ...store, metas: [...store.metas, action.payload] };

    case "update_meta":
      return {
        ...store,
        metas: store.metas.map((meta) =>
          meta.id === action.payload.id ? { ...meta, ...action.payload } : meta
        )
      };

    case "delete_meta":
      return {
        ...store,
        metas: store.metas.filter((meta) => meta.id !== action.payload)
      };

    case "toggle_meta": // ✅ nueva acción para marcar como cumplida
      return {
        ...store,
        metas: store.metas.map((meta) =>
          meta.id === action.payload
            ? { ...meta, cumplida: !meta.cumplida }
            : meta
        )
      };

    // ==== Finanzas ====
    case "set_ingresos":
      return { ...store, ingresos: action.payload };

    case "set_gastos":
      return { ...store, gastos: action.payload };

    // ==== Reflexiones ====
    case "set_reflexion":
      return { ...store, reflexion: action.payload };

    case "add_reflexion":
      return {
        ...store,
        historialReflexiones: [
          {
            id: Date.now(),
            texto: action.payload,
            fecha: new Date().toLocaleString()
          },
          ...(Array.isArray(store.historialReflexiones)
            ? store.historialReflexiones
            : [])
        ]
      };

    case "delete_reflexion":
      return {
        ...store,
        historialReflexiones: store.historialReflexiones.filter(
          (ref) => ref.id !== action.payload
        )
      };

    // ==== Otros casos que ya tuvieras ====
    // ...

    default:
      throw Error("Unknown action.");
  }
}

// -------------------------------
// Contexto global y Provider
// -------------------------------
import React, { createContext, useContext, useReducer, useEffect } from "react";
const StoreContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [store, dispatch] = useReducer(storeReducer, initialStore());

  // -------------------------------
  // Todas las acciones disponibles
  // -------------------------------
  const actions = {
    // ==== Acciones originales ====
    setMessage: (msg) => dispatch({ type: "set_message", payload: msg }),

    addTodo: (todo) => dispatch({ type: "add_todo", payload: todo }),
    updateTodo: (todo) => dispatch({ type: "update_todo", payload: todo }),
    deleteTodo: (id) => dispatch({ type: "delete_todo", payload: id }),

    // ==== Metas ====
    setMetas: (metas) => dispatch({ type: "set_metas", payload: metas }),
    addMeta: (meta) => dispatch({ type: "add_meta", payload: meta }),
    updateMeta: (meta) => dispatch({ type: "update_meta", payload: meta }),
    deleteMeta: (id) => dispatch({ type: "delete_meta", payload: id }),
    toggleMeta: (id) => dispatch({ type: "toggle_meta", payload: id }), // ✅ nueva acción

    // ==== Finanzas ====
    setIngresos: (valor) => dispatch({ type: "set_ingresos", payload: valor }),
    setGastos: (valor) => dispatch({ type: "set_gastos", payload: valor }),

    // ==== Reflexiones ====
    setReflexion: (texto) =>
      dispatch({ type: "set_reflexion", payload: texto }),
    addReflexion: (texto) =>
      dispatch({ type: "add_reflexion", payload: texto }),
    deleteReflexion: (id) =>
      dispatch({ type: "delete_reflexion", payload: id }),

    // ==== Otras acciones originales ====
    // ...
  };

  // -------------------------------
  // Sincronización con localStorage
  // -------------------------------
  useEffect(() => {
    localStorage.setItem("globalStore", JSON.stringify(store));
  }, [store]);

  return (
    <StoreContext.Provider value={{ store, actions }}>
      {children}
    </StoreContext.Provider>
  );
};

// Hook para usar el store en cualquier componente
export const useGlobalReducer = () => useContext(StoreContext);