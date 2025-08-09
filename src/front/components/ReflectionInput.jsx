import React, { useState } from 'react';

// Componente para escribir reflexiones personales
const ReflectionInput = ({ onSubmit }) => {
  const [reflection, setReflection] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    const value = e.target.value;
    setReflection(value);
    setCharCount(value.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reflection.trim().length === 0) return alert('Escribe algo antes de enviar.');

    onSubmit(reflection.trim());
    setReflection('');
    setCharCount(0);
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Tu reflexión de hoy</h3>
      <textarea
        value={reflection}
        onChange={handleChange}
        placeholder="¿Qué aprendiste hoy? ¿Cómo te sentiste?"
        rows={6}
        style={textareaStyle}
      />
      <div style={footerStyle}>
        <span>{charCount}/500</span>
        <button type="submit">Guardar reflexión</button>
      </div>
    </form>
  );
};

// Estilos
const formStyle = {
  maxWidth: '600px',
  margin: '1rem auto',
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#fefefe'
};

const textareaStyle = {
  width: '100%',
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '6px',
  border: '1px solid #ddd',
  resize: 'vertical'
};

const footerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '0.5rem'
};

export default ReflectionInput;