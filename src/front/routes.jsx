import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { GlobalProvider } from "./store.jsx"; // ⬅️ Importa tu provider
import Layout from "./pages/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Resumen from "./pages/Resumen.jsx";
import Budgeting from "./pages/Budgeting.jsx";
import Transacciones from "./pages/Transacciones.jsx";
import Metas from "./pages/Metas.jsx";
import Reflexion from "./pages/Reflexion.jsx";
import Calendario from "./pages/Calendario.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <GlobalProvider> {/* ⬅️ Envuelve el layout */}
          <Layout />
        </GlobalProvider>
      }
      errorElement={<h1>404 - Página no encontrada</h1>}
    >
      <Route index element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/resumen" element={<Resumen />} />
      <Route path="/budgeting" element={<Budgeting />} />
  <Route path="/historial" element={<Transacciones />} />
      <Route path="/metas" element={<Metas />} />
      <Route path="/reflexion" element={<Reflexion />} />
      <Route path="/calendario" element={<Calendario />} />
    </Route>
  )
);