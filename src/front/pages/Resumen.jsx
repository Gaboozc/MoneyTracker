import React, { useState } from "react";
import { useCalendarDashboard } from "../Context/CalendarDashboardContext";
import { useGlobalReducer } from "../store";
import { downloadReport } from "../utils/reportGenerator";
import "../styles/Resumen.css";

const Resumen = () => {
    const { store } = useGlobalReducer();
    const { notas } = useCalendarDashboard();
    const [periodoActual, setPeriodoActual] = useState(() => {
        const now = new Date();
        return {
            tipo: "mes", // "mes" o "año"
            año: now.getFullYear(),
            mes: now.getMonth() + 1
        };
    });

    // Función para obtener los datos del período seleccionado
    const getDatosPeriodo = () => {
        if (!Array.isArray(notas)) return { ingresos: 0, gastos: 0, metas: [], reflexiones: [] };

        const esMismoMes = (fecha, mes, año) => {
            const date = new Date(fecha);
            return date.getFullYear() === año && date.getMonth() + 1 === mes;
        };

        const esMismoAño = (fecha, año) => {
            const date = new Date(fecha);
            return date.getFullYear() === año;
        };

        const notasFiltradas = notas.filter(nota => {
            if (periodoActual.tipo === "mes") {
                return esMismoMes(nota.fecha, periodoActual.mes, periodoActual.año);
            } else {
                return esMismoAño(nota.fecha, periodoActual.año);
            }
        });

        const ingresos = notasFiltradas
            .filter(n => n.tipo === "ingreso")
            .reduce((sum, n) => sum + Number(n.monto), 0);

        const gastos = notasFiltradas
            .filter(n => n.tipo === "egreso")
            .reduce((sum, n) => sum + Number(n.monto), 0);

        // Filtrar metas del período
        const metas = store.metas.filter(meta => {
            // TODO: Agregar lógica para filtrar metas por período cuando se implemente
            return true;
        });

        return { ingresos, gastos, metas };
    };

    const datos = getDatosPeriodo();
    const balance = datos.ingresos - datos.gastos;

    return (
        <section className="resumen-container">
            <header className="resumen-header">
                <h1>📊 Resumen {periodoActual.tipo === "mes" ? "Mensual" : "Anual"}</h1>
                <div className="periodo-selector">
                    <select
                        value={periodoActual.tipo}
                        onChange={(e) => setPeriodoActual(prev => ({ ...prev, tipo: e.target.value }))}
                    >
                        <option value="mes">Vista Mensual</option>
                        <option value="año">Vista Anual</option>
                    </select>

                    {periodoActual.tipo === "mes" && (
                        <select
                            value={periodoActual.mes}
                            onChange={(e) => setPeriodoActual(prev => ({ ...prev, mes: Number(e.target.value) }))}
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(2000, i).toLocaleDateString("es-ES", { month: "long" })}
                                </option>
                            ))}
                        </select>
                    )}

                    <select
                        value={periodoActual.año}
                        onChange={(e) => setPeriodoActual(prev => ({ ...prev, año: Number(e.target.value) }))}
                    >
                        {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </header>

            <div className="resumen-grid">
                {/* Card de Finanzas */}
                <div className="card finanzas">
                    <h2>💰 Resumen Financiero</h2>
                    <ul>
                        <li>Ingresos: <span className="success">${datos.ingresos.toFixed(2)}</span></li>
                        <li>Gastos: <span className="danger">${datos.gastos.toFixed(2)}</span></li>
                        <li>Balance: <span className={balance >= 0 ? "success" : "danger"}>${balance.toFixed(2)}</span></li>
                    </ul>
                </div>

                {/* Card de Metas */}
                <div className="card metas">
                    <h2>🎯 Metas {periodoActual.tipo === "mes" ? "del Mes" : "del Año"}</h2>
                    <ul>
                        <li>Total de metas: <span>{datos.metas.length}</span></li>
                        <li>Cumplidas: <span className="success">
                            {datos.metas.filter(m => m.cumplida).length}
                        </span></li>
                        <li>Pendientes: <span className="danger">
                            {datos.metas.filter(m => !m.cumplida).length}
                        </span></li>
                    </ul>
                </div>

                {/* Botones de Descarga */}
                <div className="card acciones">
                    <h2>📥 Descargar Resumen</h2>
                    <div className="botones-descarga">
                        <button
                            className="btn-descarga"
                            onClick={() => {
                                const datosDescarga = {
                                    ingresos: datos.ingresos,
                                    gastos: datos.gastos,
                                    metas: datos.metas,
                                    transacciones: notas.filter(n => {
                                        const fecha = new Date(n.fecha);
                                        return periodoActual.tipo === "mes"
                                            ? (fecha.getFullYear() === periodoActual.año && fecha.getMonth() + 1 === periodoActual.mes)
                                            : fecha.getFullYear() === periodoActual.año;
                                    })
                                };
                                downloadReport(datosDescarga, periodoActual);
                            }}
                        >
                            Descargar Reporte PDF
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Resumen;