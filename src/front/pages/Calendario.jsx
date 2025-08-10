import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendario.css";

export default function Calendario() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoOperacion, setTipoOperacion] = useState("");
  const [tag, setTag] = useState("");
  const [comentario, setComentario] = useState("");

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => {
    setMostrarModal(false);
    setTipoOperacion("");
    setTag("");
    setComentario("");
  };

  const guardarOperacion = () => {
    if (!tipoOperacion || !tag || !comentario) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const nuevaOperacion = {
      fecha: fechaSeleccionada.toLocaleDateString(),
      tipo: tipoOperacion,
      tag,
      comentario,
    };

    console.log("Transacción guardada:", nuevaOperacion);
    cerrarModal();
  };

  return (
    <div className="calendario-container">
      <h2>Selecciona un día</h2>
      <Calendar onChange={setFechaSeleccionada} value={fechaSeleccionada} />
      <div className="detalle-dia">
        <h3>{fechaSeleccionada.toLocaleDateString()}</h3>
        <button className="btn-transaccion" onClick={abrirModal}>
          Agregar Transacción
        </button>
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Formulario de Transacción</h3>

            <label>Tipo de operación</label>
            <select
              value={tipoOperacion}
              onChange={(e) => setTipoOperacion(e.target.value)}
              className="modal-select"
            >
              <option value="">Selecciona tipo</option>
              <option value="ingreso">Ingreso</option>
              <option value="egreso">Egreso</option>
            </select>

            <label>Tag</label>
            <input
              type="text"
              placeholder="Ej. Comida, Transporte"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />

            <label>Comentario</label>
            <textarea
              placeholder="Agrega una descripción..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={3}
            />

            <div className="modal-buttons">
              <button onClick={guardarOperacion}>Guardar</button>
              <button onClick={cerrarModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}