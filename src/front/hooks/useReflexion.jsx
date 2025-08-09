// 🧘 Hook personalizado para manejar reflexiones del usuario
import { useContext } from "react";
import { DataContext } from "../Context/DataContext";

const useReflexion = () => {
  // 1️⃣ Accede al contexto global de reflexiones
  const { reflexiones, setReflexiones } = useContext(DataContext);

  // 2️⃣ Agrega una nueva reflexión
  const agregarReflexion = (nuevaReflexion) => {
    setReflexiones((prev) => [...prev, nuevaReflexion]);
  };

  // 3️⃣ Elimina una reflexión por su ID
  const eliminarReflexion = (id) => {
    setReflexiones((prev) => prev.filter((r) => r.id !== id));
  };

  // 4️⃣ Retorna el estado y las funciones disponibles
  return { reflexiones, agregarReflexion, eliminarReflexion };
};

export default useReflexion;