import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useGlobalReducer } from "../store"; // ✅ necesario para acceder a metas
import "../styles/Dashboard.css";

/* ----------------------------------------------------------------------------- */
/* Utilidades puras */
/* ----------------------------------------------------------------------------- */

const isValidISODate = (str) => /^\d{4}-\d{2}-\d{2}$/.test(str);
const toYYYYMM = (fecha) => (isValidISODate(fecha) ? fecha.slice(0, 7) : "");
const getMonthLabel = (yyyyMm, locale = "es-MX") => {
  if (!/^\d{4}-\d{2}$/.test(yyyyMm)) return "Mes inválido";
  const [y, m] = yyyyMm.split("-").map(Number);
  const label = new Date(y, m - 1).toLocaleString(locale, { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
};
const getDaysInMonth = (yyyyMm) => {
  if (!/^\d{4}-\d{2}$/.test(yyyyMm)) return 30;
  const [y, m] = yyyyMm.split("-").map(Number);
  return new Date(y, m, 0).getDate();
};
const sumByType = (notas = [], tipo) =>
  notas.reduce((acc, n) => (n?.tipo === tipo ? acc + (Number(n.monto) || 0) : acc), 0);
const groupGastosByCategoria = (notas = []) => {
  const map = new Map();
  for (const n of notas) {
    if (n?.tipo !== "egreso") continue;
    const nombre = String(n.categoria || "Sin categoría");
    const totalPrev = map.get(nombre)?.total || 0;
    map.set(nombre, {
      nombre,
      total: totalPrev + (Number(n.monto) || 0),
      color: n?.color || null,
    });
  }
  return Array.from(map.values());
};
const fallbackColor = (i) => {
  const palette = ["#0ea5e9", "#22c55e", "#eab308", "#ef4444", "#a78bfa", "#14b8a6", "#f97316"];
  return palette[i % palette.length];
};
const buildFormatter = (moneda) => {
  try {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: moneda || "MXN" });
  } catch {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });
  }
};
const safeFormat = (fmt, value) => {
  const v = Number(value);
  return fmt.format(Number.isFinite(v) ? v : 0);
};

/* ----------------------------------------------------------------------------- */
/* Componente reutilizable de tarjeta (añadido) */
/* ----------------------------------------------------------------------------- */
function DashboardCard({ icon, title, children, extraClass = "" }) {
  return (
    <div className={`card ${extraClass}`}>
      <div className="card-icon" aria-hidden>
        {icon}
      </div>
      <div className="card-info">
        <h4>{title}</h4>
        {children}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------- */
/* Componente principal */
/* ----------------------------------------------------------------------------- */

export default function Dashboard({ notas = [], moneda = "MXN", categorias = [] }) {
  const { store, actions } = useGlobalReducer(); // ✅ acceso al store global
  const [mesVisible, setMesVisible] = useState("");
  const [mesesDisponibles, setMesesDisponibles] = useState([]);

  const fmt = useMemo(() => buildFormatter(moneda), [moneda]);

  useEffect(() => {
    if (!Array.isArray(notas) || notas.length === 0) {
      setMesesDisponibles([]);
      setMesVisible("");
      return;
    }

    const setMeses = new Set();
    for (const n of notas) {
      if (n?.fecha && isValidISODate(n.fecha)) {
        const mm = toYYYYMM(n.fecha);
        if (mm) setMeses.add(mm);
      }
    }

    const ordenados = Array.from(setMeses).sort((a, b) => b.localeCompare(a));
    setMesesDisponibles(ordenados);
    setMesVisible((prev) => (prev && ordenados.includes(prev) ? prev : ordenados[0] || ""));
  }, [notas]);

  const notasFiltradas = useMemo(() => {
    if (!mesVisible) return [];
    return (Array.isArray(notas) ? notas : []).filter(
      (n) => n?.fecha && isValidISODate(n.fecha) && toYYYYMM(n.fecha) === mesVisible
    );
  }, [notas, mesVisible]);

  const { ingresos, gastos, balance } = useMemo(() => {
    const ingresos = sumByType(notasFiltradas, "ingreso");
    const gastos = sumByType(notasFiltradas, "egreso");
    return { ingresos, gastos, balance: ingresos - gastos };
  }, [notasFiltradas]);

  const { diasMes, promedioDiario } = useMemo(() => {
    const dias = getDaysInMonth(mesVisible);
    const promedio = dias ? balance / dias : 0;
    return { diasMes: dias, promedioDiario: promedio };
  }, [mesVisible, balance]);

  const categoriasCalculadas = useMemo(() => {
    const base = Array.isArray(categorias) && categorias.length > 0
      ? categorias
      : groupGastosByCategoria(notasFiltradas);
    return base.map((c, i) => ({
      nombre: String(c?.nombre || "Sin categoría"),
      total: Number(c?.total) || 0,
      color: c?.color || fallbackColor(i),
    }));
  }, [categorias, notasFiltradas]);

  const totalTransacciones = notasFiltradas.length;

  return (
    <div className="dashboard-container">
      <div className="dash-header">
        <label htmlFor="mes-selector" className="sr-only">Selecciona mes</label>
        <select
          id="mes-selector"
          className="mes-selector"
          value={mesVisible}
          onChange={(e) => setMesVisible(e.target.value)}
          aria-label="Selecciona mes"
        >
          {mesesDisponibles.length === 0 ? (
            <option value="">Sin meses disponibles</option>
          ) : (
            mesesDisponibles.map((mes) => (
              <option key={mes} value={mes}>
                {getMonthLabel(mes)}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="dash-cards">
        {/* === Primeros 3 === */}
        <div className="card ingreso">
          <div className="card-icon" aria-hidden>💵</div>
          <div className="card-info">
            <h4>Ingresos</h4>
            <strong>{safeFormat(fmt, ingresos)}</strong>
            <div
              className="mini-chart ingreso-chart"
              data-total={ingresos}
              data-mes={mesVisible}
              title={`Ingresos en ${getMonthLabel(mesVisible)}`}
            />
          </div>
        </div>

        <div className="card gasto">
          <div className="card-icon" aria-hidden>📉</div>
          <div className="card-info">
            <h4>Gastos</h4>
            <strong>{safeFormat(fmt, gastos)}</strong>
            <div
              className="mini-chart gasto-chart"
              data-total={gastos}
              data-mes={mesVisible}
              title={`Gastos en ${getMonthLabel(mesVisible)}`}
            />
          </div>
        </div>

        <div className={`card balance ${balance >= 0 ? "positivo" : "negativo"}`}>
          <div className="card-icon" aria-hidden>📊</div>
          <div className="card-info">
            <h4>Balance</h4>
            <strong>{safeFormat(fmt, balance)}</strong>
            <div
              className="mini-chart balance-chart"
              data-total={balance}
              data-mes={mesVisible}
              title={`Balance en ${getMonthLabel(mesVisible)}`}
            />
          </div>
        </div>

        {/* === Últimos 3 adaptados === */}
        <div className="card resumen">
          <div className="card-icon" aria-hidden>📑</div>
          <div className="card-info">
            <h4>Resumen</h4>
            <p>{totalTransacciones} transacciones</p>
            <p>
              Promedio diario: {safeFormat(fmt, promedioDiario)}{" "}
              <span className="muted">({diasMes} días)</span>
            </p>
          </div>
        </div>

        <div className="card categorias">
          <div className="card-icon" aria-hidden>📂</div>
          <div className="card-info">
            <h4>Categorías</h4>
            {categoriasCalculadas.length === 0 ? (
              <p className="sin-datos">Sin datos</p>
            ) : (
              <div className="donut-chart" role="list" aria-label="Gastos por categoría">
                {categoriasCalculadas.map((cat, i) => (
                  <div key={`${cat.nombre}-${i}`} className="cat-item" role="listitem">
                    <span className="cat-color" style={{ background: cat.color }} aria-hidden />
                    {cat.nombre} ({safeFormat(fmt, cat.total)})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card metas">
          <div className="card-icon" aria-hidden>🎯</div>
          <div className="card-info">
            <h4>Metas</h4>
            {store.metas.length === 0 ? (
              <p className="sin-datos">Sin metas</p>
            ) : (
              <ul className="metas-list">
                {store.metas.map((meta) => (
                  <li key={meta.id} className={meta.cumplida ? "cumplida" : ""}>
                    <span>{meta.titulo}</span>
                    <div className="acciones">
                      <button
                        title="Marcar como cumplida"
                        onClick={() => actions.toggleMeta(meta.id)}
                      >
                        ✅
                      </button>
                      <button
                        title="Eliminar meta"
                        onClick={() => actions.deleteMeta(meta.id)}
                      >
                        🗑
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------- */
/* Tipado de props */
/* ----------------------------------------------------------------------------- */
Dashboard.propTypes = {
  notas: PropTypes.arrayOf(
    PropTypes.shape({
      fecha: PropTypes.string,
      tipo: PropTypes.oneOf(["ingreso", "egreso"]),
      monto: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      categoria: PropTypes.string,
      color: PropTypes.string,
    })
  ),
  moneda: PropTypes.string,
  categorias: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
      color: PropTypes.string,
    })
  ),
};
