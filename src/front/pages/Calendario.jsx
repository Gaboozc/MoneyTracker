// ============================================================================
// Calendario.jsx
// ============================================================================
// - Usa react-calendar para la vista mensual.
// - Persiste notas y moneda en localStorage.
// - Muestra un modal con:
//     * Balance acumulado hasta la fecha seleccionada (no solo el del día).
//     * Formulario para agregar registros (ingreso/egreso).
//     * Lista de movimientos del día.
// - En el calendario:
//     * NO se muestra saldo en cada celda (solo puntos de actividad).
//     * Se muestran divisiones tipo cuadrícula mediante CSS.
// - Sin botón superior de "Agregar transacción", como pediste.
// ============================================================================

// ====== IMPORTS ======
import React, {
  useMemo,
  useState,
  useEffect,
} from "react";

import Calendar from "react-calendar";                 // Librería externa del calendario
import "react-calendar/dist/Calendar.css";             // Estilos base de react-calendar
import "../styles/Calendario.css";                     // Estilos personalizados (ver Parte 3)

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * dateKey
 * Normaliza cualquier Date a un string AAAA-MM-DD en UTC.
 * Esto evita desfases de zona horaria al agrupar por día.
 */
const dateKey = (d) => {
  const y = d.getFullYear();
  const m = d.getMonth();
  const day = d.getDate();
  const utc = new Date(Date.UTC(y, m, day));
  return utc.toISOString().slice(0, 10);
};

/**
 * Helpers para operar claves de fecha en horario LOCAL sin desfases.
 * - keyFromLocalDate: Date local -> "YYYY-MM-DD"
 * - dateFromKeyLocal: "YYYY-MM-DD" -> Date local (00:00 local)
 * - addDaysKeyLocal: suma días a una clave "YYYY-MM-DD"
 */
const keyFromLocalDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const dateFromKeyLocal = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d); // 00:00 local
};
const addDaysKeyLocal = (key, days = 1) => {
  const dt = dateFromKeyLocal(key);
  dt.setDate(dt.getDate() + days);
  return keyFromLocalDate(dt);
};

/**
 * generateId
 * Crea un ID único para cada registro usando timestamp + fragmento aleatorio.
 */
const generateId = () =>
  `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

// ============================================================================
// COMPONENTE: DetalleDiaModal
// - Recibe "balanceAcumulado" desde el padre (Calendario)
// - NO calcula aquí el acumulado; solo lo muestra para evitar inconsistencias.
// ============================================================================
const DetalleDiaModal = ({
  fecha,               // Date del día seleccionado
  notas,               // Movimientos de ese día (array)
  onClose,             // Cierra el modal
  onAdd,               // Agrega un movimiento
  onDelete,            // Elimina un movimiento por id
  moneda,              // Código de moneda actual
  setMoneda,           // Setter para cambiar moneda global
  balanceAcumulado,    // Balance acumulado hasta esta fecha (calculado arriba)
}) => {
  // ----- Estados del formulario -----
  const [tipo, setTipo] = useState("egreso"); // "ingreso" | "egreso"
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [detalle, setDetalle] = useState("");
  const [error, setError] = useState("");

  // ----- Formateador de moneda (dependiente de 'moneda') -----
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: moneda,
      }),
    [moneda]
  );
  const format = (n) => formatter.format(n ?? 0);

  // ----- Fecha legible para el encabezado del modal -----
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

  // ----- Limpia campos del formulario -----
  const limpiar = () => {
    setMonto("");
    setCategoria("");
    setDetalle("");
    setError("");
  };

  // ----- Submit de nuevo movimiento -----
  const handleSubmit = (e) => {
    e.preventDefault();

    // Normaliza coma a punto, parsea y valida
    const num = Number.parseFloat(String(monto).replace(",", "."));
    if (!Number.isFinite(num) || num <= 0) {
      setError("Ingresa un monto válido mayor a 0.");
      return;
    }

    // Construye el nuevo registro
    onAdd({
      id: generateId(),
      tipo,
      monto: Math.round(num * 100) / 100,
      categoria:
        categoria?.trim() || (tipo === "ingreso" ? "Ingreso" : "Egreso"),
      detalle: detalle?.trim() || "",
      fecha: dateKey(fecha), // se guarda la fecha normalizada
    });

    // Limpia campos tras agregar
    limpiar();
  };

  // ----- Render del modal -----
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* Cabecera con fecha y cerrar */}
        <div className="modal-header">
          <h3>{fechaLegible}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Selector de moneda */}
        <div className="moneda-selector">
          <label>Moneda: </label>
          <select
            value={moneda}
            onChange={(e) => setMoneda(e.target.value)}
          >
            <option value="MXN">MXN — Peso mexicano</option>
            <option value="USD">USD — Dólar estadounidense</option>
            <option value="EUR">EUR — Euro</option>
            {/* Agrega más si las necesitas */}
          </select>
        </div>

        {/* Balance acumulado hasta esta fecha */}
        <div className="modal-summary">
          <div
            className={`sum-item balance ${
              balanceAcumulado >= 0 ? "positivo" : "negativo"
            }`}
          >
            <span>Balance acumulado</span>
            <strong>{format(balanceAcumulado)}</strong>
          </div>
        </div>

        {/* Formulario para agregar movimiento */}
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
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Categoría"
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

        {/* Lista de registros del día */}
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
  // --------------------------------------------------------------------------
  // ESTADOS PERSISTENTES: notas y moneda
  // --------------------------------------------------------------------------
  const [notas, setNotas] = useState(() => {
    try {
      const raw = localStorage.getItem("notas_calendario");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("notas_calendario", JSON.stringify(notas));
  }, [notas]);

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

  // --------------------------------------------------------------------------
  // ESTADO DE UI: selección de fecha y modal
  // --------------------------------------------------------------------------
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
  // BALANCE ACUMULADO: se propaga a días sin movimientos
  //   - Creamos un Map fecha -> balance acumulado hasta esa fecha (incluida).
  //   - Iteramos día por día desde la primera nota hasta la última o la fecha
  //     seleccionada (la mayor), en horario LOCAL para evitar desfases.
  //   - Luego, para fechas fuera de ese rango, resolvemos buscando el último
  //     saldo previo disponible (ver getBalanceAcumuladoParaFecha()).
  // --------------------------------------------------------------------------
  const acumuladoPorFecha = useMemo(() => {
    const acc = new Map();
    let balance = 0;

    if (notas.length === 0) return acc;

    // Ordenamos por clave de fecha (YYYY-MM-DD) ascendente
    const ordenadas = [...notas].sort((a, b) => (a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0));

    // Determinamos el rango en términos de CLAVE (local)
    const primeraClave = ordenadas[0].fecha;
    const ultimaClaveNotas = ordenadas[ordenadas.length - 1].fecha;
    const claveSeleccionada = fechaSeleccionada ? keyFromLocalDate(fechaSeleccionada) : null;
    const ultimaClave = claveSeleccionada && claveSeleccionada > ultimaClaveNotas ? claveSeleccionada : ultimaClaveNotas;

    // Iteración día a día usando claves locales, evitando Date UTC
    for (let key = primeraClave; key <= ultimaClave; key = addDaysKeyLocal(key, 1)) {
      // Movimientos del día "key"
      const movimientos = ordenadas.filter((n) => n.fecha === key);

      // Sumamos ingresos/egresos de ese día
      for (const n of movimientos) {
        const monto = n.monto ?? 0;
        balance += n.tipo === "ingreso" ? monto : -monto;
      }

      // Guardamos el balance acumulado al cierre de ese día
      acc.set(key, balance);
    }

    return acc;
  }, [notas, fechaSeleccionada]);

  // Lista de fechas del mapa acumulado, ordenadas ascendente (para búsquedas)
  const clavesAcumuladoAsc = useMemo(() => {
    const arr = Array.from(acumuladoPorFecha.keys());
    arr.sort(); // YYYY-MM-DD se ordena lexicográficamente bien
    return arr;
  }, [acumuladoPorFecha]);

  /**
   * getBalanceAcumuladoParaFecha
   * - Devuelve el balance acumulado para cualquier fecha.
   * - Si no existe clave exacta en el mapa (p.ej., días sin movimientos fuera
   *   del rango de notas), busca el saldo más reciente anterior.
   * - Si no hay notas previas, retorna 0.
   */
  const getBalanceAcumuladoParaFecha = (fecha) => {
    if (!fecha) return 0;

    // Usamos clave local para coherencia con el mapa acumulado
    const key = keyFromLocalDate(fecha);

    // 1) Si existe exacta en el mapa:
    if (acumuladoPorFecha.has(key)) {
      return acumuladoPorFecha.get(key);
    }

    // 2) Buscar el saldo previo más cercano (clave <= key)
    //    Como clavesAcumuladoAsc está ordenado, iteramos hasta pasar la fecha.
    let ultimoSaldo = 0;
    for (const k of clavesAcumuladoAsc) {
      if (k <= key) {
        ultimoSaldo = acumuladoPorFecha.get(k) ?? ultimoSaldo;
      } else {
        break;
      }
    }

    return ultimoSaldo;
  };

  // --------------------------------------------------------------------------
  // NOTAS DEL DÍA SELECCIONADO
  // --------------------------------------------------------------------------
  const notasDelDia = useMemo(() => {
    if (!fechaSeleccionada) return [];
    return notasPorFecha.get(dateKey(fechaSeleccionada)) || [];
  }, [fechaSeleccionada, notasPorFecha]);

  // --------------------------------------------------------------------------
  // CONTENIDO DE LA CELDA DEL CALENDARIO (solo puntos de actividad)
  //   - NO mostramos saldos en celdas (requisito explícito).
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
  // RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="calendario-container">
      {/* Sin botón superior de agregar: se abre el modal al hacer click en un día */}

      <div className="calendario-wrap">
        <Calendar
          // Localización opcional (si tienes Intl y locale correctos)
          locale="es-MX"

          // Al hacer clic en un día, abrimos el modal de detalle
          onClickDay={(date) => {
            setFechaSeleccionada(date);
            setMostrarModal(true);
          }}

          // Contenido visual adicional (puntos)
          tileContent={tileContent}
        />
      </div>

      {/* Modal con detalle del día seleccionado */}
      {mostrarModal && fechaSeleccionada && (
        <DetalleDiaModal
          fecha={fechaSeleccionada}
          notas={notasDelDia}
          onClose={() => setMostrarModal(false)}
          onAdd={(nueva) => setNotas((prev) => [...prev, nueva])}
          onDelete={(id) =>
            setNotas((prev) => prev.filter((n) => n.id !== id))
          }
          moneda={moneda}
          setMoneda={setMoneda}
          // Balance acumulado exacto para la fecha seleccionada,
          // con propagación a días sin movimientos.
          balanceAcumulado={getBalanceAcumuladoParaFecha(fechaSeleccionada)}
        />
      )}
    </div>
  );
};

// Export por defecto del componente principal
export default Calendario;