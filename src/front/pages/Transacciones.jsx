import React, { useMemo } from "react";
import { useCalendarDashboard } from "../Context/CalendarDashboardContext.jsx";

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const Transacciones = () => {
  const { notas, setNotas } = useCalendarDashboard();

  // Ordena todas las transacciones cronológicamente descendente
  const transaccionesOrdenadas = useMemo(() => {
    return [...notas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [notas]);

  // Agregar nota independiente a una transacción
  const agregarNota = (id, nuevaNota) => {
    setNotas(prev => prev.map(tx =>
      tx.id === id
        ? { ...tx, notas: [...(tx.notas || []), nuevaNota] }
        : tx
    ));
  };

  return (
    <section className="transacciones-container">
      <header>
        <h1>📑 Todas tus transacciones</h1>
        <p>Consulta y agrega notas independientes a cada transacción.</p>
      </header>
      <div className="transacciones-list">
        {transaccionesOrdenadas.length > 0 ? (
          transaccionesOrdenadas.map(tx => (
            <div key={tx.id} className="transaccion-item">
              <div className="transaccion-fecha">{formatearFecha(tx.fecha)}</div>
              <div className="transaccion-info">
                <span className="transaccion-categoria">{tx.categoria}</span>
                <span className="transaccion-detalle">{tx.detalle}</span>
                <span className={`transaccion-monto ${tx.tipo}`}>{tx.tipo === 'egreso' ? '-' : '+'} ${tx.monto}</span>
              </div>
              {/* Notas independientes */}
              <div className="notas-independientes">
                <ul>
                  {(tx.notas || []).map((nota, i) => (
                    <li key={i}>{nota}</li>
                  ))}
                </ul>
                <input type="text" placeholder="Agregar nota..." onKeyDown={e => {
                  if(e.key === 'Enter' && e.target.value) {
                    agregarNota(tx.id, e.target.value);
                    e.target.value = '';
                  }
                }} />
              </div>
            </div>
          ))
        ) : (
          <div className="no-resultados">
            <p>No hay transacciones registradas.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Transacciones;
