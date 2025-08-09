import React, { useState } from 'react';

// Lista de estados de ánimo disponibles
const moods = [
  { label: 'Feliz', emoji: '😄' },
  { label: 'Triste', emoji: '😢' },
  { label: 'Enojado', emoji: '😠' },
  { label: 'Relajado', emoji: '😌' },
  { label: 'Ansioso', emoji: '😰' },
  { label: 'Motivado', emoji: '💪' },
  { label: 'Creativo', emoji: '🎨' },
  { label: 'Cansado', emoji: '😴' }
];

// Componente principal
const MoodSelector = ({ onMoodSelect }) => {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleSelect = (mood) => {
    setSelectedMood(mood.label);
    if (onMoodSelect) onMoodSelect(mood.label);
  };

  return (
    <div style={containerStyle}>
      <h3>¿Cómo te sientes hoy?</h3>
      <div style={gridStyle}>
        {moods.map((mood, index) => (
          <button
            key={index}
            onClick={() => handleSelect(mood)}
            style={{
              ...buttonStyle,
              backgroundColor: selectedMood === mood.label ? '#d0f0c0' : '#fff'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{mood.emoji}</span>
            <span>{mood.label}</span>
          </button>
        ))}
      </div>
      {selectedMood && (
        <p style={{ marginTop: '1rem' }}>
          Estado seleccionado: <strong>{selectedMood}</strong>
        </p>
      )}
    </div>
  );
};

// Estilos
const containerStyle = {
  textAlign: 'center',
  padding: '1rem'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
  gap: '0.5rem',
  marginTop: '1rem'
};

const buttonStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0.5rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  cursor: 'pointer',
  backgroundColor: '#fff',
  transition: 'background-color 0.3s'
};

export default MoodSelector;