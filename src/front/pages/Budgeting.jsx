import React, { useState } from 'react';
import { useGlobalReducer } from "../store";
import "../styles/Budgeting.css";

// Planes de presupuesto predefinidos
const BUDGET_PLANS = {
    balanced: {
        name: "Plan Balanceado (50/30/20)",
        description: "El plan más común para una distribución equilibrada del ingreso",
        distribution: {
            necesidades: 0.5,    // 50% para necesidades básicas
            deseos: 0.3,         // 30% para gastos discrecionales
            ahorro: 0.2          // 20% para ahorro e inversión
        }
    },
    conservative: {
        name: "Plan Conservador (60/20/20)",
        description: "Plan enfocado en necesidades básicas, ideal para ingresos ajustados",
        distribution: {
            necesidades: 0.6,    // 60% para necesidades básicas
            deseos: 0.2,         // 20% para gastos discrecionales
            ahorro: 0.2          // 20% para ahorro e inversión
        }
    },
    aggressive: {
        name: "Plan Agresivo (40/30/30)",
        description: "Plan orientado al ahorro, ideal para crecimiento patrimonial",
        distribution: {
            necesidades: 0.4,    // 40% para necesidades básicas
            deseos: 0.3,         // 30% para gastos discrecionales
            ahorro: 0.3          // 30% para ahorro e inversión
        }
    }
};

const Budgeting = () => {
    const { store, actions } = useGlobalReducer();
    const [selectedPlan, setSelectedPlan] = useState('balanced');
    const [income, setIncome] = useState('');

    // Calcular distribución según el plan seleccionado
    const calculateDistribution = (amount) => {
        const plan = BUDGET_PLANS[selectedPlan].distribution;
        const numAmount = parseFloat(amount) || 0;

        return {
            necesidades: numAmount * plan.necesidades,
            deseos: numAmount * plan.deseos,
            ahorro: numAmount * plan.ahorro
        };
    };

    const distribution = calculateDistribution(income);

    // Formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    return (
        <div className="budgeting-container">
            <header className="budgeting-header">
                <h1>💰 Planificación de Presupuesto</h1>
                <p>Selecciona un plan y calcula la distribución óptima de tus ingresos</p>
            </header>

            <div className="budget-grid">
                {/* Selector de Plan */}
                <section className="card plan-selector">
                    <h2>🎯 Planes Disponibles</h2>
                    <div className="plans-container">
                        {Object.entries(BUDGET_PLANS).map(([key, plan]) => (
                            <div
                                key={key}
                                className={`plan-option ${selectedPlan === key ? 'selected' : ''}`}
                                onClick={() => setSelectedPlan(key)}
                            >
                                <h3>{plan.name}</h3>
                                <p>{plan.description}</p>
                                <div className="plan-distribution">
                                    <div className="dist-bar necesidades" style={{ flex: plan.distribution.necesidades }}></div>
                                    <div className="dist-bar deseos" style={{ flex: plan.distribution.deseos }}></div>
                                    <div className="dist-bar ahorro" style={{ flex: plan.distribution.ahorro }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Calculadora */}
                <section className="card calculator">
                    <h2>🧮 Calculadora</h2>
                    <div className="calculator-content">
                        <div className="input-group">
                            <label htmlFor="income">Ingreso Mensual:</label>
                            <input
                                id="income"
                                type="number"
                                value={income}
                                onChange={(e) => setIncome(e.target.value)}
                                placeholder="Ingresa tu ingreso mensual"
                            />
                        </div>

                        <div className="distribution-results">
                            <div className="dist-item necesidades">
                                <h4>Necesidades Básicas</h4>
                                <p className="amount">{formatCurrency(distribution.necesidades)}</p>
                                <p className="percentage">
                                    {(BUDGET_PLANS[selectedPlan].distribution.necesidades * 100)}%
                                </p>
                                <ul>
                                    <li>Renta/Hipoteca</li>
                                    <li>Servicios básicos</li>
                                    <li>Alimentación</li>
                                    <li>Transporte</li>
                                </ul>
                            </div>

                            <div className="dist-item deseos">
                                <h4>Gastos Discrecionales</h4>
                                <p className="amount">{formatCurrency(distribution.deseos)}</p>
                                <p className="percentage">
                                    {(BUDGET_PLANS[selectedPlan].distribution.deseos * 100)}%
                                </p>
                                <ul>
                                    <li>Entretenimiento</li>
                                    <li>Restaurantes</li>
                                    <li>Compras no esenciales</li>
                                    <li>Hobbies</li>
                                </ul>
                            </div>

                            <div className="dist-item ahorro">
                                <h4>Ahorro e Inversión</h4>
                                <p className="amount">{formatCurrency(distribution.ahorro)}</p>
                                <p className="percentage">
                                    {(BUDGET_PLANS[selectedPlan].distribution.ahorro * 100)}%
                                </p>
                                <ul>
                                    <li>Fondo de emergencia</li>
                                    <li>Inversiones</li>
                                    <li>Retiro</li>
                                    <li>Metas financieras</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Metas Actuales */}
                <section className="card current-goals">
                    <h2>📋 Metas Financieras</h2>
                    <div className="goals-content">
                        {store.metas.length === 0 ? (
                            <p className="no-goals">No hay metas establecidas</p>
                        ) : (
                            <ul className="goals-list">
                                {store.metas.map((meta) => (
                                    <li key={meta.id} className={meta.cumplida ? 'completed' : ''}>
                                        <span className="goal-title">{meta.titulo}</span>
                                        <div className="goal-actions">
                                            <button
                                                onClick={() => actions.toggleMeta(meta.id)}
                                                className="toggle-goal"
                                            >
                                                {meta.cumplida ? '✓' : '○'}
                                            </button>
                                            <button
                                                onClick={() => actions.deleteMeta(meta.id)}
                                                className="delete-goal"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Budgeting;