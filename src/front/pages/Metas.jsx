import React, { useMemo, useState } from "react";
import { useGlobalReducer } from "../store.jsx";
import "../styles/Metas.css";

const Metas = () => {
  const { store, actions } = useGlobalReducer();
  const { metas } = store;
  const [mostrarModal, setMostrarModal] = useState(false);
  const [aporteModal, setAporteModal] = useState({ open: false, metaId: null, monto: "", fecha: new Date().toISOString().slice(0,10), error: "" });
  const [form, setForm] = useState({
    titulo: "",
    montoObjetivo: "",
    moneda: "MXN",
    fechaLimite: "",
    favorita: false,
    montoInicial: "",
  });

  const resetForm = () => setForm({ titulo: "", montoObjetivo: "", moneda: "MXN", fechaLimite: "", favorita: false, montoInicial: "" });

  const handleCrearMeta = () => {
    const titulo = String(form.titulo || "").trim();
    const objetivo = Number(form.montoObjetivo) || 0;
    if (!titulo || objetivo <= 0) return;
    const inicial = Number(form.montoInicial) || 0;
    const nueva = {
      id: Date.now(),
      titulo,
      emoji: "🎯",
      montoObjetivo: objetivo,
      moneda: form.moneda || "MXN",
      fechaLimite: form.fechaLimite || null,
      favorita: !!form.favorita,
      cumplida: false,
      ahorrado: Math.max(0, inicial),
      aportes: inicial > 0 ? [{ id: Date.now(), monto: inicial, fecha: new Date().toISOString().slice(0,10) }] : [],
    };
    actions.addMeta(nueva);
    resetForm();
    setMostrarModal(false);
  };

  const handleToggleCumplida = (id) => actions.toggleMeta(id);
  const handleEliminar = (id) => actions.deleteMeta(id);
  const handleToggleFavorita = (id) => actions.toggleFavoritaMeta(id);
  const handleAgregarAporte = (id) => {
    setAporteModal({ open: true, metaId: id, monto: "", fecha: new Date().toISOString().slice(0,10), error: "" });
  };
  const closeAporteModal = () => setAporteModal((s) => ({ ...s, open: false }));
  const submitAporte = () => {
    const montoNum = Number(aporteModal.monto);
    if (!Number.isFinite(montoNum) || montoNum <= 0) {
      setAporteModal((s) => ({ ...s, error: "Ingresa un monto válido mayor a 0" }));
      return;
    }
    const fechaVal = aporteModal.fecha || new Date().toISOString().slice(0,10);
    actions.addAporteMeta(aporteModal.metaId, { id: Date.now(), monto: montoNum, fecha: fechaVal });
    setAporteModal({ open: false, metaId: null, monto: "", fecha: new Date().toISOString().slice(0,10), error: "" });
  };

  // 📊 Cálculo de progreso
  const total = metas.length;
  const cumplidas = metas.filter((m) => m.cumplida).length;
  const progreso = total ? (cumplidas / total) * 100 : 0;

  const fmt = useMemo(() => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }), []);
  const formatMoney = (moneda, v) => {
    try {
      return new Intl.NumberFormat("es-MX", { style: "currency", currency: moneda || "MXN" }).format(Number(v) || 0);
    } catch {
      return fmt.format(Number(v) || 0);
    }
  };

  return (
    <section className="metas-container">
      {/* 🧠 Encabezado */}
      <header className="metas-header">
        <h1>🎯 Mis Metas</h1>
        <p>Registra, sigue y completa tus objetivos</p>
      </header>

      {/* ➕ Nueva meta con modal */}
      <div className="metas-add card blue">
        <button onClick={() => setMostrarModal(true)}>+ Nueva meta</button>
      </div>

      {/* 📈 Barra de progreso */}
      {total > 0 && (
        <div className="metas-progreso card green">
          <div className="progreso-header">
            <h2>Progreso de metas</h2>
            <span className="badge-pct">{Math.round(progreso)}%</span>
          </div>
          <div className="progreso-bar" aria-label="Progreso de metas" role="progressbar" aria-valuenow={Math.round(progreso)} aria-valuemin={0} aria-valuemax={100}>
            <div className="progreso-fill" style={{ width: `${progreso}%` }}>
              <span className="progreso-label">{Math.round(progreso)}%</span>
            </div>
          </div>
          <div className="progreso-stats" aria-hidden>
            <div className="stat">
              <strong>{cumplidas}</strong>
              <span>Completadas</span>
            </div>
            <div className="stat">
              <strong>{Math.max(0, total - cumplidas)}</strong>
              <span>Pendientes</span>
            </div>
            <div className="stat">
              <strong>{total}</strong>
              <span>Totales</span>
            </div>
          </div>
        </div>
      )}

      {/* 📋 Lista de metas detalladas */}
      <div className="metas-lista card yellow">
        <h2>Todas mis metas</h2>
        {total > 0 ? (
          <ul>
            {metas.map((m) => {
              const porcentaje = m.montoObjetivo > 0 ? Math.min(100, Math.round((Number(m.ahorrado || 0) / Number(m.montoObjetivo)) * 100)) : 0;
              const restante = Math.max(0, Number(m.montoObjetivo) - Number(m.ahorrado || 0));
              const deadline = m.fechaLimite ? new Date(m.fechaLimite) : null;
              const hoy = new Date();
              const mesesRestantes = deadline ? Math.max(0, Math.ceil((deadline - hoy) / (1000 * 60 * 60 * 24 * 30))) : null;
              const ritmoSugerido = mesesRestantes && mesesRestantes > 0 ? Math.ceil(restante / mesesRestantes / 4) * 1 : null; // aprox semanal

              return (
                <li key={m.id} className={m.cumplida ? "cumplida" : ""}>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 22 }} aria-hidden>{m.emoji || "🎯"}</span>
                        <strong>{m.titulo || m.texto || "[Sin título]"}</strong>
                        <button title="Favorita" onClick={() => handleToggleFavorita(m.id)} style={{ marginLeft: 8 }}>
                          {m.favorita ? "⭐" : "☆"}
                        </button>
                      </div>
                      <div className="progress" style={{ height: 14 }}>
                        <div className="progress-fill" style={{ width: `${porcentaje}%` }} />
                      </div>
                      <div className="progress-text">
                        {porcentaje}% — Objetivo: {formatMoney(m.moneda, m.montoObjetivo)} | Ahorrado: {formatMoney(m.moneda, m.ahorrado || 0)} | Restan: {formatMoney(m.moneda, restante)}
                      </div>
                      {m.fechaLimite && (
                        <div className="muted">Fecha límite: {new Date(m.fechaLimite).toLocaleDateString("es-MX")}{mesesRestantes !== null ? ` • Restan ${mesesRestantes}m` : ""}</div>
                      )}
                      {ritmoSugerido && restante > 0 && (
                        <div className="muted">Sugerencia: ahorra ~{formatMoney(m.moneda, ritmoSugerido)} por semana para llegar a tiempo.</div>
                      )}
                    </div>

                    <div className="acciones">
                      <button onClick={() => handleAgregarAporte(m.id)} title="Agregar aporte">➕</button>
                      <button onClick={() => handleToggleCumplida(m.id)} title="Marcar cumplida">{m.cumplida ? "❌" : "✅"}</button>
                      <button onClick={() => handleEliminar(m.id)} title="Eliminar">🗑</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No hay metas registradas.</p>
        )}
      </div>

      {/* Modal crear meta */}
      {mostrarModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Nueva Meta</h3>
              <button className="modal-close" onClick={() => setMostrarModal(false)} aria-label="Cerrar">✖</button>
            </div>
            <div className="modal-body">
              <label>
                <span className="field-label">Nombre de la meta</span>
                <input type="text" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ej. Viaje a Cancún" />
              </label>
              <label>
                <span className="field-label">Monto objetivo</span>
                <input type="number" min="0" value={form.montoObjetivo} onChange={(e) => setForm({ ...form, montoObjetivo: e.target.value })} placeholder="25000" />
              </label>
              <label>
                <span className="field-label">Moneda</span>
                <select value={form.moneda} onChange={(e) => setForm({ ...form, moneda: e.target.value })}>
                  <option>MXN</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </label>
              <label>
                <span className="field-label">Fecha límite</span>
                <input type="date" value={form.fechaLimite} onChange={(e) => setForm({ ...form, fechaLimite: e.target.value })} />
              </label>
              <label className="checkbox-inline">
                <input type="checkbox" checked={form.favorita} onChange={(e) => setForm({ ...form, favorita: e.target.checked })} />
                <span>Marcar como favorita ⭐</span>
              </label>
              <label>
                <span className="field-label">Monto inicial (opcional)</span>
                <input type="number" min="0" value={form.montoInicial} onChange={(e) => setForm({ ...form, montoInicial: e.target.value })} placeholder="0" />
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn ghost" onClick={() => setMostrarModal(false)}>Cancelar</button>
              <button className="btn primary" onClick={handleCrearMeta}>Guardar Meta</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal agregar aporte */}
      {aporteModal.open && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Agregar aporte</h3>
              <button className="modal-close" onClick={closeAporteModal} aria-label="Cerrar">✖</button>
            </div>
            <div className="modal-body">
              <label>
                <span className="field-label">Monto</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={aporteModal.monto}
                  onChange={(e) => setAporteModal((s) => ({ ...s, monto: e.target.value, error: "" }))}
                  placeholder="Ej. 1000"
                />
              </label>
              <label>
                <span className="field-label">Fecha</span>
                <input
                  type="date"
                  value={aporteModal.fecha}
                  onChange={(e) => setAporteModal((s) => ({ ...s, fecha: e.target.value }))}
                />
              </label>
              {aporteModal.error && <div className="error-text" role="alert">{aporteModal.error}</div>}
            </div>
            <div className="modal-actions">
              <button className="btn ghost" onClick={closeAporteModal}>Cancelar</button>
              <button className="btn primary" onClick={submitAporte}>Agregar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Metas;