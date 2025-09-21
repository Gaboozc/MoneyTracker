import React, { useMemo, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TendenciasChart = ({ data, periodo = 'mensual' }) => {
  const [tipoGrafica, setTipoGrafica] = useState('line');

  const chartData = useMemo(() => {
    // Agrupar datos por fecha
    const agrupado = data.reduce((acc, item) => {
      const fecha = new Date(item.fecha);
      const key = periodo === 'mensual' 
        ? `${fecha.getFullYear()}-${fecha.getMonth() + 1}`
        : fecha.toISOString().split('T')[0];
      
      if (!acc[key]) {
        acc[key] = { ingresos: 0, gastos: 0 };
      }
      
      if (item.tipo === 'ingreso') {
        acc[key].ingresos += item.monto;
      } else {
        acc[key].gastos += item.monto;
      }
      
      return acc;
    }, {});

    // Ordenar fechas
    const fechasOrdenadas = Object.keys(agrupado).sort();
    
    return {
      labels: fechasOrdenadas.map(fecha => {
        if (periodo === 'mensual') {
          const [year, month] = fecha.split('-');
          return `${['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][month - 1]} ${year}`;
        }
        return fecha;
      }),
      datasets: [
        {
          label: 'Ingresos',
          data: fechasOrdenadas.map(fecha => agrupado[fecha].ingresos),
          borderColor: 'green',
          backgroundColor: 'rgba(0,200,0,0.1)',
          fill: true,
        },
        {
          label: 'Gastos',
          data: fechasOrdenadas.map(fecha => agrupado[fecha].gastos),
          borderColor: 'red',
          backgroundColor: 'rgba(200,0,0,0.1)',
          fill: true,
        }
      ]
    };
  }, [data, periodo]);

  // Datos para Pie chart (total ingresos vs gastos)
  const pieData = useMemo(() => {
    const totalIngresos = data.filter(i => i.tipo === 'ingreso').reduce((acc, i) => acc + i.monto, 0);
    const totalGastos = data.filter(i => i.tipo === 'gasto').reduce((acc, i) => acc + i.monto, 0);
    return {
      labels: ['Ingresos', 'Gastos'],
      datasets: [
        {
          data: [totalIngresos, totalGastos],
          backgroundColor: ['#4caf50', '#f44336'],
        }
      ]
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tendencias de Ingresos y Gastos',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div>
      <div style={{textAlign:'right', marginBottom:'1em'}}>
        <button onClick={() => setTipoGrafica(tipoGrafica === 'line' ? 'pie' : 'line')}>
          Cambiar a gráfica {tipoGrafica === 'line' ? 'de pastel' : 'de líneas'}
        </button>
      </div>
      {tipoGrafica === 'line' ? (
        <div className="tendencias-chart">
          <div className="chart-container">
            <Line data={chartData} options={options} height={300} />
          </div>
        </div>
      ) : (
        <Pie data={pieData} />
      )}
    </div>
  );
};

export default TendenciasChart;