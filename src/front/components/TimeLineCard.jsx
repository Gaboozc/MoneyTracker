import React from 'react';

// Componente para mostrar un evento en la línea de tiempo
const TimelineCard = ({ title, content, date, mood, icon }) => {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        {icon && <span style={iconStyle}>{icon}</span>}
        <h4 style={{ margin: 0 }}>{title}</h4>
        <span style={dateStyle}>{formatDate(date)}</span>
      </div>

      {mood && <p style={moodStyle}>Estado emocional: <strong>{mood}</strong></p>}

      <p style={contentStyle}>{content}</p>
    </div>
  );
};

// Estilos
const cardStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1rem',
  marginBottom: '1rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '0.5rem'
};

const iconStyle = {
  fontSize: '1.5rem',
  marginRight: '0.5rem'
};

const dateStyle = {
  fontSize: '0.85rem',
  color: '#888'
};

const moodStyle = {
  fontStyle: 'italic',
  color: '#555',
  marginBottom: '0.5rem'
};

const contentStyle = {
  fontSize: '1rem',
  lineHeight: '1.4'
};

// Función para formatear fecha
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default TimelineCard;