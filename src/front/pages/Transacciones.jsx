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

// Registra los componentes de ChartJS
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

const formatearMesAnio = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long'
  });
};

// Generador dinámico de colores para categorías
const generarColores = (n) => {
  const colores = [];
  for (let i = 0; i < n; i++) {
    const hue = (i * 137.508) % 360;
    colores.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colores;
};

const Transacciones = () => {
  const { notas, setNotas } = useCalendarDashboard();
  const [chartType, setChartType] = useState('line');
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Ordena todas las transacciones cronológicamente descendente
  const transaccionesOrdenadas = useMemo(() => {
    return [...notas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [notas]);

  // Agrupa las transacciones por mes y año para el dropdown
  const transaccionesAgrupadas = useMemo(() => {
    return transaccionesOrdenadas.reduce((acc, tx) => {
      const mesAnio = formatearMesAnio(tx.fecha);
      if (!acc[mesAnio]) {
        acc[mesAnio] = [];
      }
      acc[mesAnio].push(tx);
      return acc;
    }, {});
  }, [transaccionesOrdenadas]);

  // Filtra las transacciones según el mes seleccionado en el dropdown
  const transaccionesFiltradas = useMemo(() => {
    if (selectedMonth === 'all') {
      return transaccionesOrdenadas;
    }
    return transaccionesAgrupadas[selectedMonth] || [];
  }, [selectedMonth, transaccionesOrdenadas, transaccionesAgrupadas]);

  // Prepara los datos para las gráficas basándose en las transacciones filtradas
  const chartData = useMemo(() => {
    const fechas = [];
    const ingresos = [];
    const egresos = [];
    const totalPorCategoria = {};

    transaccionesFiltradas.forEach(tx => {
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
      } else {
        egresos[index] += monto;
      }

      if (!totalPorCategoria[tx.categoria]) {
        totalPorCategoria[tx.categoria] = { ingreso: 0, egreso: 0 };
      }
      totalPorCategoria[tx.categoria][tx.tipo] += monto;
    });

    const categorias = Object.keys(totalPorCategoria);
    const coloresCategorias = generarColores(categorias.length);

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
        labels: categorias,
        datasets: [{
          data: Object.values(totalPorCategoria).map(v => Math.abs(v.egreso)),
          backgroundColor: coloresCategorias
        }]
      }
    };
  }, [transaccionesFiltradas]);

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

  const agregarNota = (id, nuevaNota) => {
    setNotas(prev => prev.map(tx =>
      tx.id === id
        ? { ...tx, notas: [...(tx.notas || []), nuevaNota] }
        : tx
    ));
  };

  return (
    <section className="transacciones-container">
      <header>
        <h1>📑 Todas tus transacciones</h1>
        <p>Consulta y agrega notas independientes a cada transacción.</p>
      </header>
      <div className="split-layout">
        <div className="transacciones-list">
          <div className="filter-controls">
            <label htmlFor="month-select">Filtrar por mes:</label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="all">Todos los meses</option>
              {Object.keys(transaccionesAgrupadas).map(mesAnio => (
                <option key={mesAnio} value={mesAnio}>{mesAnio}</option>
              ))}
            </select>
          </div>
          {transaccionesFiltradas.length > 0 ? (
            transaccionesFiltradas.map(tx => (
              <div key={tx.id} className="transaccion-item">
                <div className="transaccion-fecha">{formatearFecha(tx.fecha)}</div>
                <div className="transaccion-info">
                  <span className="transaccion-categoria">{tx.categoria}</span>
                  <span className="transaccion-detalle">{tx.detalle}</span>
                  <span className={`transaccion-monto ${tx.tipo}`}>{tx.tipo === 'egreso' ? '-' : '+'}${tx.monto}</span>
                </div>
                {/* Notas independientes */}
                <div className="notas-independientes">
                  <ul>
                    {(tx.notas || []).map((nota, i) => (
                      <li key={i}>{nota}</li>
                    ))}
                  </ul>
                  <input
                    type="text"
                    placeholder="Agregar nota..."
                    onKeyDown={e => {
                      if (e.key === 'Enter' && e.target.value) {
                        agregarNota(tx.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
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