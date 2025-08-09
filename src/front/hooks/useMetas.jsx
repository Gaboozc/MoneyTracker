// 🎯 Hook personalizado para manejar metas del usuario
import { useContext } from "react";
import { DataContext } from "../Context/DataContext";

const useMetas = () => {
  // 1️⃣ Accede al contexto global de metas
  const { metas, setMetas } = useContext(DataContext);

  // 2️⃣ Agrega una nueva meta
  const agregarMeta = (nuevaMeta) => {
    setMetas((prev) => [...prev, nuevaMeta]);
  };

  // 3️⃣ Marca una meta como cumplida por su ID
  const completarMeta = (id) => {
    setMetas((prev) =>
      prev.map((meta) =>
        meta.id === id ? { ...meta, cumplida: true } : meta
      )
    );
  };

  // 4️⃣ Elimina una meta por su ID
  const eliminarMeta = (id) => {
    setMetas((prev) => prev.filter((meta) => meta.id !== id));
  };

  // 5️⃣ Retorna el estado y las funciones disponibles
  return { metas, agregarMeta, completarMeta, eliminarMeta };
};

export default useMetas;