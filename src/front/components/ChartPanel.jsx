import React from 'react';
import {
  Bar,
  Line,
  Pie,
  Doughnut
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Registramos los componentes necesarios
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const ChartPanel = ({ type = 'bar', title = '', labels = [], data = [], backgroundColors = [], borderColors = [] }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: backgroundColors.length ? backgroundColors : 'rgba(75, 192, 192, 0.2)',
        borderColor: borderColors.length ? borderColors : 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: !!title,
        text: title
      }
    }
  };

  // Renderiza el tipo de gráfica según la prop "type"
  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={options} />;
      case 'bar':
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: 'auto' }}>
      {renderChart()}
    </div>
  );
};

export default ChartPanel;