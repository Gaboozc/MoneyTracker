import React, { useState } from 'react';

// Componente para establecer metas mensuales
const MetaForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    mes: '',
    anio: '',
    metaIngresos: '',
    metaGastos: '',
    metaAhorro: ''
  });

  // Actualiza el estado al escribir en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Envía los datos al componente padre
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica
    if (!formData.mes || !formData.anio) return alert('Mes y año son obligatorios');

    const parsedData = {
      mes: parseInt(formData.mes),
      anio: parseInt(formData.anio),
      metaIngresos: parseFloat(formData.metaIngresos || 0),
      metaGastos: parseFloat(formData.metaGastos || 0),
      metaAhorro: parseFloat(formData.metaAhorro || 0)
    };

    onSubmit(parsedData);
    setFormData({
      mes: '',
      anio: '',
      metaIngresos: '',
      metaGastos: '',
      metaAhorro: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Establecer Metas Financieras</h3>

      <label>Mes:</label>
      <select name="mes" value={formData.mes} onChange={handleChange} required>
        <option value="">Selecciona</option>
        {monthOptions.map((m, i) => (
          <option key={i} value={i + 1}>{m}</option>
        ))}
      </select>

      <label>Año:</label>
      <input
        type="number"
        name="anio"
        value={formData.anio}
        onChange={handleChange}
        required
      />

      <label>Meta de Ingresos:</label>
      <input
        type="number"
        name="metaIngresos"
        value={formData.metaIngresos}
        onChange={handleChange}
      />

      <label>Meta de Gastos:</label>
      <input
        type="number"
        name="metaGastos"
        value={formData.metaGastos}
        onChange={handleChange}
      />

      <label>Meta de Ahorro:</label>
      <input
        type="number"
        name="metaAhorro"
        value={formData.metaAhorro}
        onChange={handleChange}
      />

      <button type="submit">Guardar Meta</button>
    </form>
  );
};

// Opciones de meses
const monthOptions = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Estilos básicos
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  maxWidth: '400px',
  margin: '1rem auto',
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9'
};

export default MetaForm;