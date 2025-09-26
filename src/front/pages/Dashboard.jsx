import React, { useMemo, useState, useEffect } from "react";
import { useCalendarDashboard } from "../Context/CalendarDashboardContext";
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

export default function Dashboard({ moneda = "MXN", categorias = [] }) {
  const { store, actions } = useGlobalReducer();
  const { notas, mesSeleccionado, setMesSeleccionado } = useCalendarDashboard();
  const [mesesDisponibles, setMesesDisponibles] = useState([]);
  const fmt = useMemo(() => buildFormatter(moneda), [moneda]);
  const [reflexionInput, setReflexionInput] = useState("");

  useEffect(() => {
    if (!Array.isArray(notas) || notas.length === 0) {
      setMesesDisponibles([]);
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
  }, [notas]);

  const notasFiltradas = useMemo(() => {
    if (!mesSeleccionado) return [];
    return (Array.isArray(notas) ? notas : []).filter(
      (n) => n?.fecha && isValidISODate(n.fecha) && toYYYYMM(n.fecha) === mesSeleccionado
    );
  }, [notas, mesSeleccionado]);

  const { ingresos, gastos, balance } = useMemo(() => {
    const ingresos = sumByType(notasFiltradas, "ingreso");
    const gastos = sumByType(notasFiltradas, "egreso");
    return { ingresos, gastos, balance: ingresos - gastos };
  }, [notasFiltradas]);

  const { diasMes, promedioDiario } = useMemo(() => {
    const dias = getDaysInMonth(mesSeleccionado);
    // Solo consideramos los egresos para el promedio diario
    const promedio = dias ? (gastos / dias) : 0;
    return { diasMes: dias, promedioDiario: promedio };
  }, [mesSeleccionado, gastos]);

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
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(e.target.value)}
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
              data-mes={mesSeleccionado}
              title={`Ingresos en ${getMonthLabel(mesSeleccionado)}`}
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
              data-mes={mesSeleccionado}
              title={`Gastos en ${getMonthLabel(mesSeleccionado)}`}
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
              data-mes={mesSeleccionado}
              title={`Balance en ${getMonthLabel(mesSeleccionado)}`}
            />
          </div>
        </div>

        {/* === Últimos 3 adaptados === */}
        <div className="card resumen">
          <div className="card-icon" aria-hidden>📑</div>
          <div className="card-info">
            <h4>Resumen de Gastos</h4>
            <p>{notasFiltradas.filter(n => n.tipo === "egreso").length} gastos</p>
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
            <h4>⭐ Metas favoritas</h4>
            {store.metas.length === 0 ? (
              <p className="sin-datos">Sin metas</p>
            ) : (
              (() => {
                const metas = Array.isArray(store.metas) ? store.metas : [];
                const favoritas = metas.filter(m => m.favorita);
                const restantes = metas.filter(m => !m.favorita);
                const sortByDeadline = (arr) => arr.sort((a, b) => {
                  const da = a.fechaLimite ? new Date(a.fechaLimite).getTime() : Infinity;
                  const db = b.fechaLimite ? new Date(b.fechaLimite).getTime() : Infinity;
                  return da - db;
                });
                const seleccion = (favoritas.length > 0 ? sortByDeadline(favoritas) : sortByDeadline(restantes)).slice(0, 5);

                const hoy = new Date();
                const mesesRestantes = (m) => m.fechaLimite ? Math.max(0, Math.ceil((new Date(m.fechaLimite) - hoy) / (1000*60*60*24*30))) : null;
                const pct = (m) => m.montoObjetivo > 0 ? Math.min(100, Math.round((Number(m.ahorrado||0)/Number(m.montoObjetivo))*100)) : 0;

                return (
                  <ul className="metas-list-compact">
                    {seleccion.map((m) => (
                      <li key={m.id} className={m.cumplida ? "cumplida" : ""}>
                        <span>{m.emoji || "🎯"} {m.titulo || "[Sin título]"}</span>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div className="progress" style={{ width:120, height:8 }}>
                            <div className="progress-fill" style={{ width: `${pct(m)}%` }} />
                          </div>
                          <span className="muted" style={{ minWidth: 40, textAlign: "right" }}>{pct(m)}%</span>
                          <span className="muted" style={{ minWidth: 70, textAlign: "right" }}>
                            {mesesRestantes(m) !== null ? `Restan ${mesesRestantes(m)}m` : ""}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                );
              })()
            )}
            <div className="more-metas"><a href="/metas">Ver todas las metas →</a></div>
          </div>
        </div>

        {/* === Reflexión del día (sección de ancho completo) === */}
        <section className="reflexion-section" aria-labelledby="reflexion-titulo">
          <header className="reflexion-header">
            <h3 id="reflexion-titulo">🧘 Reflexión del día</h3>
            <p className="muted">Escribe tus pensamientos y guarda tu evolución</p>
          </header>
          <div className="reflexion-panel">
            <textarea
              className="reflexion-textarea"
              rows={6}
              placeholder="Escribe tu reflexión..."
              value={reflexionInput}
              onChange={(e) => setReflexionInput(e.target.value)}
            />
            <div className="reflexion-actions center">
              <button
                className="reflexion-save-btn"
                onClick={() => {
                  const texto = (reflexionInput || "").trim();
                  if (!texto) return;
                  actions.addReflexion(texto);
                  setReflexionInput("");
                }}
              >
                Guardar
              </button>
            </div>
            <div className="reflexion-more">
              <a href="/reflexion" className="ver-reflexiones">Ver otras reflexiones →</a>
            </div>
          </div>
        </section>
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
