import React from 'react';

const ExportPanel = ({ data = [], filename = 'export', format = 'json' }) => {
  const handleExport = () => {
    if (!data.length) return;

    let content = '';
    let mimeType = '';
    let extension = '';

    if (format === 'json') {
      content = JSON.stringify(data, null, 2); // Formato legible
      mimeType = 'application/json';
      extension = 'json';
    } else if (format === 'csv') {
      const headers = Object.keys(data[0]);
      const rows = data.map(obj =>
        headers.map(header => `"${obj[header] ?? ''}"`).join(',')
      );
      content = [headers.join(','), ...rows].join('\n');
      mimeType = 'text/csv';
      extension = 'csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${extension}`;
    a.click();

    URL.revokeObjectURL(url); // Limpieza
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <button onClick={handleExport}>
        Exportar como {format.toUpperCase()}
      </button>
    </div>
  );
};

export default ExportPanel;