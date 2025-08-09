import React from 'react';

// Componente para mostrar resumen del año
const YearSummary = ({ year, financialData, moodStats, reflections }) => {
  const totalIngresos = financialData.reduce((sum, e) => sum + e.ingresos, 0);
  const totalGastos = financialData.reduce((sum, e) => sum + e.gastos, 0);
  const totalAhorro = financialData.reduce((sum, e) => sum + e.ahorro, 0);

  const dominantMood = getDominantMood(moodStats);

  return (
    <div style={containerStyle}>
      <h2>Resumen del Año {year}</h2>

      <section style={sectionStyle}>
        <h3>📊 Finanzas</h3>
        <p><strong>Total Ingresos:</strong> ${totalIngresos.toFixed(2)}</p>
        <p><strong>Total Gastos:</strong> ${totalGastos.toFixed(2)}</p>
        <p><strong>Total Ahorro:</strong> ${totalAhorro.toFixed(2)}</p>
      </section>

      <section style={sectionStyle}>
        <h3>😊 Estado Emocional</h3>
        <p><strong>Estado predominante:</strong> {dominantMood.emoji} {dominantMood.label}</p>
      </section>

      <section style={sectionStyle}>
        <h3>🪞 Reflexiones Destacadas</h3>
        {reflections.slice(0, 3).map((text, i) => (
          <blockquote key={i} style={quoteStyle}>
            “{text}”
          </blockquote>
        ))}
        {reflections.length > 3 && <p>...y {reflections.length - 3} más</p>}
      </section>
    </div>
  );
};

// Función para encontrar el estado emocional más frecuente
const getDominantMood = (moodStats) => {
  if (!moodStats || moodStats.length === 0) return { label: 'No disponible', emoji: '❓' };
  const sorted = [...moodStats].sort((a, b) => b.count - a.count);
  return sorted[0];
};

// Estilos
const containerStyle = {
  maxWidth: '700px',
  margin: '2rem auto',
  padding: '1rem',
  backgroundColor: '#fefefe',
  borderRadius: '10px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
};

const sectionStyle = {
  marginBottom: '1.5rem'
};

const quoteStyle = {
  fontStyle: 'italic',
  color: '#555',
  marginBottom: '0.75rem',
  borderLeft: '4px solid #ccc',
  paddingLeft: '0.5rem'
};

export default YearSummary;