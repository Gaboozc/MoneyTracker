import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // 🎨 Estilos globales para toda la app

// 🧭 Sistema de rutas
import { RouterProvider } from "react-router-dom";
import { router } from "./routes"; // Configuración de rutas

// 🧠 Estado global con useReducer
import { StoreProvider } from "./hooks/useGlobalReducer";

// 📦 Estado específico con useState (finanzas, metas, reflexiones)
import { DataProvider } from "./Context/DataContext";

// ⚠️ Componente que se muestra si falta la URL del backend
import { BackendURL } from "./components/BackendURL";

const Main = () => {
  // 🔍 Verifica si la variable de entorno VITE_BACKEND_URL está definida
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // ⚠️ Si no hay URL del backend, muestra un mensaje de configuración
  if (!backendURL || backendURL === "") {
    return (
      <React.StrictMode>
        <BackendURL />
      </React.StrictMode>
    );
  }

  // 🚀 Si la URL está definida, renderiza la app con los providers
  return (
    <React.StrictMode>
      {/* 🧠 Proveedor de estado global con useReducer */}
      <StoreProvider>
        {/* 📦 Proveedor de datos específicos con useState */}
        <DataProvider>
          {/* 🧭 Proveedor de rutas para navegación */}
          <RouterProvider router={router} />
        </DataProvider>
      </StoreProvider>
    </React.StrictMode>
  );
};

// 🖥️ Renderiza el componente Main dentro del elemento raíz del DOM
ReactDOM.createRoot(document.getElementById("root")).render(<Main />);