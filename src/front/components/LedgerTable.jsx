import React from 'react';

// Componente que recibe un arreglo de entradas financieras
const LedgerTable = ({ entries = [] }) => {
  return (
    <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {/* Encabezados de la tabla */}
            <th style={thStyle}>Mes</th>
            <th style={thStyle}>Año</th>
            <th style={thStyle}>Ingresos</th>
            <th style={thStyle}>Gastos</th>
            <th style={thStyle}>Ahorro</th>
            <th style={thStyle}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {/* Iteramos sobre cada entrada financiera */}
          {entries.map((entry, index) => {
            const balance = entry.ingresos - entry.gastos; // Calculamos el balance

            return (
              <tr key={index}>
                <td style={tdStyle}>{getMonthName(entry.mes)}</td>
                <td style={tdStyle}>{entry.anio}</td>
                <td style={tdStyle}>${entry.ingresos.toFixed(2)}</td>
                <td style={tdStyle}>${entry.gastos.toFixed(2)}</td>
                <td style={tdStyle}>${entry.ahorro.toFixed(2)}</td>
                <td style={{ ...tdStyle, color: balance >= 0 ? 'green' : 'red' }}>
                  ${balance.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Estilos para encabezados
const thStyle = {
  padding: '8px',
  backgroundColor: '#f4f4f4',
  borderBottom: '1px solid #ccc',
  textAlign: 'left'
};

// Estilos para celdas
const tdStyle = {
  padding: '8px',
  borderBottom: '1px solid #eee'
};

// Función auxiliar para convertir número de mes a nombre
const getMonthName = (month) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[month - 1] || 'Mes inválido';
};

export default LedgerTable;