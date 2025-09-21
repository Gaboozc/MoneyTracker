import React, { useState } from 'react';

const EtiquetasPersonalizadas = ({ etiquetas, onAgregarEtiqueta, onEliminarEtiqueta, onAsignarEtiqueta }) => {
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const [color, setColor] = useState('#3b82f6');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nuevaEtiqueta.trim()) {
      onAgregarEtiqueta({
        id: Date.now(),
        nombre: nuevaEtiqueta.trim(),
        color: color
      });
      setNuevaEtiqueta('');
      setColor('#3b82f6');
    }
  };

  return (
    <div className="etiquetas-container">
      <div className="etiquetas-header">
        <h3>Etiquetas personalizadas</h3>
        <form onSubmit={handleSubmit} className="etiqueta-form">
          <input
            type="text"
            value={nuevaEtiqueta}
            onChange={(e) => setNuevaEtiqueta(e.target.value)}
            placeholder="Nueva etiqueta..."
            className="etiqueta-input"
          />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="color-picker"
          />
          <button type="submit" className="btn-agregar">
            Agregar
          </button>
        </form>
      </div>
      
      <div className="etiquetas-lista">
        {etiquetas.map(etiqueta => (
          <div
            key={etiqueta.id}
            className="etiqueta-item"
            style={{ '--etiqueta-color': etiqueta.color }}
          >
            <span className="etiqueta-nombre">{etiqueta.nombre}</span>
            <button
              onClick={() => onEliminarEtiqueta(etiqueta.id)}
              className="btn-eliminar"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EtiquetasPersonalizadas;