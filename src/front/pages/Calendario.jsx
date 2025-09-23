import React, {
  useMemo,
  useState,
  useEffect,
} from "react";
import { useCalendarDashboard } from "../Context/CalendarDashboardContext";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendario.css";

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

const dateKey = (d) => {
  const y = d.getFullYear();
  const m = d.getMonth();
  const day = d.getDate();
  const utc = new Date(Date.UTC(y, m, day));
  return utc.toISOString().slice(0, 10);
};

const keyFromLocalDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const dateFromKeyLocal = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const generateId = () =>
  `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

// ============================================================================
// COMPONENTE: DetalleDiaModal
// ============================================================================
const DetalleDiaModal = ({
  fecha,
  notas,
  onClose,
  onAdd,
  onDelete,
  moneda,
  setMoneda,
  balanceAcumulado,
}) => {
  const [tipo, setTipo] = useState("egreso");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [detalle, setDetalle] = useState("");
  const [error, setError] = useState("");

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: moneda,
      }),
    [moneda]
  );
  
  const format = (n) => formatter.format(n ?? 0);

  const fechaLegible = useMemo(
    () =>
      fecha.toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [fecha]
  );

  const limpiar = () => {
    setMonto("");
    setCategoria("");
    setDetalle("");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const num = Number.parseFloat(String(monto).replace(",", "."));
    if (!Number.isFinite(num) || num <= 0) {
      setError("Ingresa un monto válido mayor a 0.");
      return;
    }

    onAdd({
      id: generateId(),
      tipo,
      monto: Math.round(num * 100) / 100,
      categoria: categoria?.trim() || (tipo === "ingreso" ? "Ingreso" : "Egreso"),
      detalle: detalle?.trim() || "",
      fecha: dateKey(fecha),
    });

    limpiar();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{fechaLegible}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="moneda-selector">
          <label>Moneda: </label>
          <select
            value={moneda}
            onChange={(e) => setMoneda(e.target.value)}
          >
            <option value="MXN">MXN — Peso mexicano</option>
            <option value="USD">USD — Dólar estadounidense</option>
            <option value="EUR">EUR — Euro</option>
          </select>
        </div>

        <div className="modal-summary">
          <div
            className={`sum-item balance ${balanceAcumulado >= 0 ? "positivo" : "negativo"}`}
          >
            <span>Balance acumulado</span>
            <strong>{format(balanceAcumulado)}</strong>
          </div>
        </div>

        <form className="form-agregar" onSubmit={handleSubmit}>
          <div className="tipo-seleccion">
            <button
              type="button"
              className={tipo === "ingreso" ? "active" : ""}
              onClick={() => setTipo("ingreso")}
            >
              💵 Ingreso
            </button>
            <button
              type="button"
              className={tipo === "egreso" ? "active" : ""}
              onClick={() => setTipo("egreso")}
            >
              📉 Egreso
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="categoria-select">Categoría</label>
            <select
              id="categoria-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="input-select"
            >
              <option value="">Selecciona categoría</option>
              <option value="Comida">🍔 Comida</option>
              <option value="Vivienda">🏠 Vivienda</option>
              <option value="Transporte">🚗 Transporte</option>
              <option value="Entretenimiento">🎉 Entretenimiento</option>
              <option value="Salud">💊 Salud</option>
              <option value="Servicios">🧾 Servicios</option>
              <option value="Trabajo">💼 Trabajo</option>
              <option value="Ahorro">💰 Ahorro</option>
            </select>
          </div>

          <input
            type="number"
            step="0.01"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="Monto"
            required
          />

          <input
            type="text"
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            placeholder="Detalle"
          />

          {error && <div className="error">{error}</div>}

          <button type="submit" className="btn-primary">
            Agregar
          </button>
        </form>

        <div className="lista-registros">
          {notas.length === 0 ? (
            <p>No hay registros.</p>
          ) : (
            notas.map((n) => (
              <div key={n.id} className={`registro ${n.tipo}`}>
                <div>
                  <strong>{n.categoria}</strong>{" "}
                  {n.detalle && `- ${n.detalle}`}
                </div>
                <div>
                  {format(n.monto)}{" "}
                  <button
                    className="btn-link danger"
                    onClick={() => onDelete(n.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL: Calendario
// ============================================================================
const Calendario = () => {
  const { notas, setNotas, mesSeleccionado, setMesSeleccionado } = useCalendarDashboard();
  
  const [moneda, setMoneda] = useState(() => {
    try {
      return localStorage.getItem("moneda_calendario") || "MXN";
    } catch {
      return "MXN";
    }
  });
  
  useEffect(() => {
    localStorage.setItem("moneda_calendario", moneda);
  }, [moneda]);
  
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // --------------------------------------------------------------------------
  // AGRUPACIÓN: Map fecha -> movimientos[]
  // --------------------------------------------------------------------------
  const notasPorFecha = useMemo(() => {
    const map = new Map();
    for (const n of notas) {
      if (!n.fecha) continue;
      if (!map.has(n.fecha)) map.set(n.fecha, []);
      map.get(n.fecha).push(n);
    }
    return map;
  }, [notas]);

  // --------------------------------------------------------------------------
  // BALANCE TOTAL - SIEMPRE EL MISMO PARA TODAS LAS FECHAS
  // --------------------------------------------------------------------------
  const balanceTotal = useMemo(() => {
    return notas.reduce((total, nota) => {
      const monto = nota.monto || 0;
      return nota.tipo === "ingreso" ? total + monto : total - monto;
    }, 0);
  }, [notas]);

  // --------------------------------------------------------------------------
  // CONTENIDO DE LA CELDA DEL CALENDARIO
  // --------------------------------------------------------------------------
  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;

    const key = dateKey(date);
    const lista = notasPorFecha.get(key) || [];

    if (!lista.length) return null;

    const hayIngreso = lista.some((n) => n.tipo === "ingreso");
    const hayEgreso = lista.some((n) => n.tipo === "egreso");

    return (
      <div className="cal-puntos">
        {hayIngreso && <span className="punto punto-ingreso" />}
        {hayEgreso && <span className="punto punto-egreso" />}
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // NOTAS DEL DÍA SELECCIONADO
  // --------------------------------------------------------------------------
  const notasDelDia = useMemo(() => {
    if (!fechaSeleccionada) return [];
    return notasPorFecha.get(dateKey(fechaSeleccionada)) || [];
  }, [fechaSeleccionada, notasPorFecha]);

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="calendario-container">
      <div className="calendario-wrap">
        <Calendar
          locale="es-MX"
          onClickDay={(date) => {
            setFechaSeleccionada(date);
            setMostrarModal(true);
            const yyyyMm = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            setMesSeleccionado(yyyyMm);
          }}
          tileContent={tileContent}
        />
      </div>

      {mostrarModal && fechaSeleccionada && (
        <DetalleDiaModal
          fecha={fechaSeleccionada}
          notas={notasDelDia}
          onClose={() => setMostrarModal(false)}
          onAdd={(nueva) => setNotas((prev) => [...prev, nueva])}
          onDelete={(id) => setNotas((prev) => prev.filter((n) => n.id !== id))}
          moneda={moneda}
          setMoneda={setMoneda}
          balanceAcumulado={balanceTotal} // SIEMPRE el balance total
        />
      )}
    </div>
  );
};

export default Calendario;