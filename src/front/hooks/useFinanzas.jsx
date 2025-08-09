// 📦 Importa React y el contexto de datos
import { useContext } from "react";
import { DataContext } from "../Context/DataContext";

// 💰 Hook personalizado para gestionar datos financieros
const useFinanzas = () => {
  // 1️⃣ Accede al contexto global de finanzas
  const { finanzas, setFinanzas } = useContext(DataContext);

  // 2️⃣ Agrega una nueva entrada financiera
  const agregarFinanza = (nuevaFinanza) => {
    setFinanzas((prev) => [...prev, nuevaFinanza]);
  };

  // 3️⃣ Elimina una entrada financiera por su ID
  const eliminarFinanza = (id) => {
    setFinanzas((prev) => prev.filter((f) => f.id !== id));
  };

  // 4️⃣ Retorna el estado y las funciones disponibles
  return { finanzas, agregarFinanza, eliminarFinanza };
};

export default useFinanzas;