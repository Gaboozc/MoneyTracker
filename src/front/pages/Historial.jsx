import React, { useState, useMemo } from "react";
import { useGlobalReducer } from "../store.jsx";
import TendenciasChart from "../components/TendenciasChart.jsx";
import EtiquetasPersonalizadas from "../components/EtiquetasPersonalizadas.jsx";
import "../styles/Historial.css";

const FilterControls = ({ startDate, endDate, onDateChange, searchTerm, onSearchChange, tipoFiltro, onTipoChange, categoriaFiltro, onCategoriaChange, tiposOpciones, categoriasOpciones, onClearFilters }) => {
  return (
    <div className="filter-controls">
      <div className="date-range">
        <div className="date-input">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onDateChange([e.target.value, endDate])}
            className="date-field"
          />
        </div>
        <div className="date-input">
          <input
            type="date"
            value={endDate}
            onChange={(e) => onDateChange([startDate, e.target.value])}
            className="date-field"
          />
        </div>
      </div>
      <input
        type="text"
        value={searchTerm}


        
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar en el historial..."
        className="search-field"
      />
      <select 
        value={tipoFiltro}
        onChange={(e) => onTipoChange(e.target.value)}
        className="filter-select"
      >
        <option value="">Tipo de transacción</option>
        {tiposOpciones.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <select
        value={categoriaFiltro}
        onChange={(e) => onCategoriaChange(e.target.value)}
        className="filter-select"
      >
        <option value="">Categoría</option>
        {categoriasOpciones.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <button 
        className="clear-filters-btn"
        onClick={onClearFilters}
      >
        <i className="fas fa-undo-alt"></i>
        Limpiar filtros
      </button>
    </div>
  );
};

// Main content area that displays transactions and charts
const MainContent = ({
  historialFiltrado,
  sortConfig,
  handleSort,
  periodoGrafico,
  setPeriodoGrafico,
  etiquetas,
  agregarEtiqueta,
  eliminarEtiqueta,
  historial,
  balance
}) => {
  return (
    <main className="historial-main">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card summary-card">
          <h3>💰 Resumen del periodo</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span>Ingresos</span>
              <span className="amount positive">
                ${historialFiltrado.reduce((acc, item) => 
                  item.tipo === 'ingreso' ? acc + item.monto : acc, 0
                ).toLocaleString('es-ES')}
              </span>
            </div>
            <div className="summary-item">
              <span>Gastos</span>
              <span className="amount negative">
                ${historialFiltrado.reduce((acc, item) => 
                  item.tipo === 'gasto' ? acc + item.monto : acc, 0
                ).toLocaleString('es-ES')}
              </span>
            </div>
            <div className="summary-item total">
              <span>Balance</span>
              <span className={`amount ${balance >= 0 ? 'positive' : 'negative'}`}>
                ${balance.toLocaleString('es-ES')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="card chart-card">
          <div className="card-header">
            <h3>📈 Tendencias</h3>
            <select 
              value={periodoGrafico} 
              onChange={(e) => setPeriodoGrafico(e.target.value)}
              className="periodo-selector"
            >
              <option value="mensual">Vista Mensual</option>
              <option value="diario">Vista Diaria</option>
            </select>
          </div>
          <TendenciasChart data={historial || []} periodo={periodoGrafico} />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transactions-section">
        <div className="card transactions-card">
          <div className="card-header with-actions">
            <h3>📝 Transacciones</h3>
            <div className="sort-controls">
              <button
                className={`sort-btn ${sortConfig.key === 'fecha' ? 'active' : ''}`}
                onClick={() => handleSort('fecha')}
              >
                Fecha {sortConfig.key === 'fecha' && (
                  <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </button>
              <button
                className={`sort-btn ${sortConfig.key === 'monto' ? 'active' : ''}`}
                onClick={() => handleSort('monto')}
              >
                Monto {sortConfig.key === 'monto' && (
                  <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </button>
              <button
                className={`sort-btn ${sortConfig.key === 'categoria' ? 'active' : ''}`}
                onClick={() => handleSort('categoria')}
              >
                Categoría {sortConfig.key === 'categoria' && (
                  <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </button>
            </div>
          </div>
          <div className="transactions-list">
            {historialFiltrado.map((item, index) => (
              <div key={index} className="transaction-item">
                <div className="transaction-date">
                  {new Date(item.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="transaction-details">
                  <span className="transaction-category">{item.categoria}</span>
                  <span className="transaction-description">{item.detalle}</span>
                </div>
                <div className={`transaction-amount ${item.tipo === 'ingreso' ? 'positive' : 'negative'}`}>
                  ${item.monto.toLocaleString('es-ES')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="tags-section">
        <div className="card tags-card">
          <h3>🏷️ Etiquetas personalizadas</h3>
          <EtiquetasPersonalizadas
            etiquetas={etiquetas}
            onAgregarEtiqueta={agregarEtiqueta}
            onEliminarEtiqueta={eliminarEtiqueta}
          />
        </div>
      </div>
    </main>
  );
};

const Historial = () => {
  const { store, actions } = useGlobalReducer();
  const { historial, ingresos, gastos, notasTransacciones } = store;

  // Estados
  const [dateRange, setDateRange] = useState([
    new Date().toISOString().split('T')[0], // Hoy
    new Date().toISOString().split('T')[0]
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: 'fecha',
    direction: 'desc'
  });
  const [etiquetas, setEtiquetas] = useState([]);
  const [periodoGrafico, setPeriodoGrafico] = useState('mensual');

  // Funciones para etiquetas
  const agregarEtiqueta = (nuevaEtiqueta) => {
    setEtiquetas(prev => [...prev, nuevaEtiqueta]);
  };

  const eliminarEtiqueta = (id) => {
    setEtiquetas(prev => prev.filter(etiqueta => etiqueta.id !== id));
  };

  // Formato de fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const balance = ingresos - gastos;

  // Opciones para los dropdowns
  const tiposOpciones = [
    { value: "ingreso", label: "Ingresos" },
    { value: "gasto", label: "Gastos" }
  ];

  const categoriasOpciones = [
    { value: "comida", label: "Comida" },
    { value: "transporte", label: "Transporte" },
    { value: "servicios", label: "Servicios" },
    { value: "entretenimiento", label: "Entretenimiento" },
    { value: "otros", label: "Otros" }
  ];

  // Función de ordenamiento
  const ordenarHistorial = (items, { key, direction }) => {
    return [...items].sort((a, b) => {
      if (key === 'fecha') {
        return direction === 'asc' 
          ? new Date(a.fecha) - new Date(b.fecha)
          : new Date(b.fecha) - new Date(a.fecha);
      }
      if (key === 'monto') {
        return direction === 'asc' 
          ? a.monto - b.monto
          : b.monto - a.monto;
      }
      if (key === 'categoria') {
        return direction === 'asc'
          ? a.categoria.localeCompare(b.categoria)
          : b.categoria.localeCompare(a.categoria);
      }
      return 0;
    });
  };

  // Manejador de ordenamiento
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' 
        ? 'desc' 
        : 'asc'
    }));
  };

  // Filtrar y ordenar el historial
  const historialFiltrado = useMemo(() => {
    if (!historial) return [];
    
    // Primero filtramos
    const filtrado = historial.filter(item => {
      const fechaItem = new Date(item.fecha);
      const fechaInicio = new Date(dateRange[0]);
      const fechaFin = new Date(dateRange[1]);
      
      const cumpleFecha = fechaItem >= fechaInicio && fechaItem <= fechaFin;
      const cumpleBusqueda = searchTerm === "" || 
        item.detalle.toLowerCase().includes(searchTerm.toLowerCase());
      const cumpleTipo = tipoFiltro === "" || item.tipo === tipoFiltro;
      const cumpleCategoria = categoriaFiltro === "" || item.categoria === categoriaFiltro;
      
      return cumpleFecha && cumpleBusqueda && cumpleTipo && cumpleCategoria;
    });

    // Luego ordenamos
    return ordenarHistorial(filtrado, sortConfig);
  }, [historial, dateRange, searchTerm, tipoFiltro, categoriaFiltro, sortConfig]);

  // Onboarding/contexto para el usuario
  const [mostrarAvanzado, setMostrarAvanzado] = useState(false);

  return (
    <section className="historial-container">
      <header className="historial-header">
        <h1>📜 Historial</h1>
        <p>Consulta tus movimientos, agrega notas y revisa tu balance. Las funciones avanzadas están disponibles si las necesitas.</p>
      </header>
      <FilterControls 
        startDate={dateRange[0]}
        endDate={dateRange[1]}
        onDateChange={setDateRange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        tipoFiltro={tipoFiltro}
        onTipoChange={setTipoFiltro}
        categoriaFiltro={categoriaFiltro}
        onCategoriaChange={setCategoriaFiltro}
        tiposOpciones={tiposOpciones}
        categoriasOpciones={categoriasOpciones}
        onClearFilters={() => {
          setDateRange([
            new Date().toISOString().split('T')[0],
            new Date().toISOString().split('T')[0]
          ]);
          setSearchTerm("");
          setTipoFiltro("");
          setCategoriaFiltro("");
          setSortConfig({ key: 'fecha', direction: 'desc' });
        }}
      />

      {/* Transacciones y notas rápidas */}
      <div className="card transactions-card">
        <h3>📝 Tus transacciones</h3>
        {historialFiltrado.length > 0 ? (
          <div className="transacciones-contenido">
            {historialFiltrado.map((item, index) => (
              <div key={item.id || item.fecha+item.monto} className="transaccion">
                <div className="transaccion-fecha">{formatearFecha(item.fecha)}</div>
                <div className="transaccion-info">
                  <span className="transaccion-categoria">{item.categoria}</span>
                  <span className="transaccion-detalle">{item.detalle}</span>
                </div>
                <span className={`transaccion-monto ${item.tipo}`}>{item.tipo === 'gasto' ? '-' : '+'} ${item.monto.toLocaleString('es-ES')}</span>
                {/* Notas rápidas */}
                <div className="notas-rapidas">
                  <ul>
                    {(notasTransacciones[item.id] || []).map((nota, i) => (
                      <li key={i}>{nota}</li>
                    ))}
                  </ul>
                  <input type="text" placeholder="Agregar nota..." onKeyDown={e => {
                    if(e.key === 'Enter' && e.target.value) {
                      actions.addNotaTransaccion(item.id, e.target.value);
                      e.target.value = '';
                    }
                  }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-resultados">
            <i className="fas fa-search"></i>
            <p>No hay transacciones registradas o no se encontraron con los filtros actuales.</p>
          </div>
        )}
      </div>
      {/* Botón para mostrar funciones avanzadas */}
      <div style={{textAlign:'center', margin:'2em 0'}}>
        <button onClick={() => setMostrarAvanzado(v => !v)} className="btn-avanzado">
          {mostrarAvanzado ? 'Ocultar funciones avanzadas' : 'Mostrar funciones avanzadas'}
        </button>
      </div>
      {/* Secciones avanzadas ocultas por defecto */}
      {mostrarAvanzado && (
        <div className="avanzado-secciones">
          {/* Auditoría/log, alertas, comparativas, visualizaciones */}
          {/* ...puedes reusar el código anterior para estas secciones aquí... */}
        </div>
      )}
    </section>
  );
};

export default Historial;