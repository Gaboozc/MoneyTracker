import React, { useMemo, useState } from "react";
import { useCalendarDashboard } from "../Context/CalendarDashboardContext.jsx";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import "../styles/Transacciones.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const Transacciones = () => {
  const { notas, setNotas } = useCalendarDashboard();

  // Ordena todas las transacciones cronológicamente descendente
  const transaccionesOrdenadas = useMemo(() => {
    return [...notas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [notas]);

  // Agregar nota independiente a una transacción
  const agregarNota = (id, nuevaNota) => {
    setNotas(prev => prev.map(tx =>
      tx.id === id
        ? { ...tx, notas: [...(tx.notas || []), nuevaNota] }
        : tx
    ));
  };

  const [chartType, setChartType] = useState('line');

  // Preparar datos para las gráficas
  const chartData = useMemo(() => {
    const fechas = [];
    const ingresos = [];
    const egresos = [];
    const totalPorCategoria = {};
    let totalIngresos = 0;
    let totalEgresos = 0;

    transaccionesOrdenadas.forEach(tx => {
      const fecha = formatearFecha(tx.fecha);
      const monto = parseFloat(tx.monto);

      if (!fechas.includes(fecha)) {
        fechas.push(fecha);
        ingresos.push(0);
        egresos.push(0);
      }

      const index = fechas.indexOf(fecha);
      if (tx.tipo === 'ingreso') {
        ingresos[index] += monto;
        totalIngresos += monto;
      } else {
        egresos[index] += monto;
        totalEgresos += monto;
      }

      // Acumular por categoría
      if (!totalPorCategoria[tx.categoria]) {
        totalPorCategoria[tx.categoria] = { ingreso: 0, egreso: 0 };
      }
      totalPorCategoria[tx.categoria][tx.tipo] += monto;
    });

    return {
      line: {
        labels: fechas,
        datasets: [
          {
            label: 'Ingresos',
            data: ingresos,
            borderColor: 'rgb(5, 150, 105)',
            backgroundColor: 'rgba(5, 150, 105, 0.1)',
            tension: 0.3
          },
          {
            label: 'Egresos',
            data: egresos,
            borderColor: 'rgb(220, 38, 38)',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            tension: 0.3
          }
        ]
      },
      pie: {
        labels: Object.keys(totalPorCategoria),
        datasets: [{
          data: Object.values(totalPorCategoria).map(v => Math.abs(v.egreso)),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(220, 38, 38, 0.8)',
            'rgba(5, 150, 105, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(28, 250, 239, 0.8)',
          ]
        }]
      }
    };
  }, [transaccionesOrdenadas]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: chartType === 'line' ? 'Flujo de Ingresos y Egresos' : 'Distribución por Categoría'
      }
    }
  };

  return (
    <section className="transacciones-container">
      <header>
        <h1>📑 Todas tus transacciones</h1>
        <p>Consulta y agrega notas independientes a cada transacción.</p>
      </header>
      <div className="split-layout">
        <div className="transacciones-list">
          {transaccionesOrdenadas.length > 0 ? (
            transaccionesOrdenadas.map(tx => (
              <div key={tx.id} className="transaccion-item">
                <div className="transaccion-fecha">{formatearFecha(tx.fecha)}</div>
                <div className="transaccion-info">
                  <span className="transaccion-categoria">{tx.categoria}</span>
                  <span className="transaccion-detalle">{tx.detalle}</span>
                  <span className={`transaccion-monto ${tx.tipo}`}>{tx.tipo === 'egreso' ? '-' : '+'} ${tx.monto}</span>
                </div>
                {/* Notas independientes */}
                <div className="notas-independientes">
                  <ul>
                    {(tx.notas || []).map((nota, i) => (
                      <li key={i}>{nota}</li>
                    ))}
                  </ul>
                  <input type="text" placeholder="Agregar nota..." onKeyDown={e => {
                    if (e.key === 'Enter' && e.target.value) {
                      agregarNota(tx.id, e.target.value);
                      e.target.value = '';
                    }
                  }} />
                </div>
              </div>
            ))
          ) : (
            <div className="no-resultados">
              <p>No hay transacciones registradas.</p>
            </div>
          )}
        </div>

        <div className="charts-section">
          <div className="charts-header">
            <h2>Análisis de transacciones</h2>
            <div className="chart-toggle">
              <button
                className={chartType === 'line' ? 'active' : ''}
                onClick={() => setChartType('line')}
              >
                Línea
              </button>
              <button
                className={chartType === 'pie' ? 'active' : ''}
                onClick={() => setChartType('pie')}
              >
                Torta
              </button>
            </div>
          </div>
          <div className="chart-container">
            {chartType === 'line' ? (
              <Line data={chartData.line} options={chartOptions} />
            ) : (
              <Pie data={chartData.pie} options={chartOptions} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Transacciones;
