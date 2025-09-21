import React, { createContext, useContext, useState, useEffect } from "react";

const CalendarDashboardContext = createContext();

const STORAGE_KEY = "prisma_moneytracker_data";
const VERSION_KEY = "prisma_moneytracker_version";
const CURRENT_VERSION = "1.0";

// Función para verificar si localStorage está disponible
const isLocalStorageAvailable = () => {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
};

export function CalendarDashboardProvider({ children }) {
    // Verificar la versión de los datos almacenados
    useEffect(() => {
        if (isLocalStorageAvailable()) {
            const storedVersion = localStorage.getItem(VERSION_KEY);
            if (storedVersion !== CURRENT_VERSION) {
                // Si la versión es diferente o no existe, actualizar la versión
                localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
            }
        }
    }, []);

    // Inicializar estado desde localStorage con mejor manejo de errores
    const [notas, setNotas] = useState(() => {
        if (!isLocalStorageAvailable()) {
            console.warn("localStorage no está disponible");
            return [];
        }

        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (!savedData) return [];

            const parsedData = JSON.parse(savedData);
            return Array.isArray(parsedData) ? parsedData : [];
        } catch (error) {
            console.error("Error loading data from localStorage:", error);
            return [];
        }
    });

    const [mesSeleccionado, setMesSeleccionado] = useState(() => {
        const date = new Date();
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    });

    // Función para guardar datos de forma segura
    const saveToLocalStorage = (data) => {
        if (!isLocalStorageAvailable()) return;

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error("Error saving data to localStorage:", error);
        }
    };

    // Guardar notas en localStorage cuando cambien
    useEffect(() => {
        saveToLocalStorage(notas);
    }, [notas]);

    return (
        <CalendarDashboardContext.Provider value={{ notas, setNotas, mesSeleccionado, setMesSeleccionado }}>
            {children}
        </CalendarDashboardContext.Provider>
    );
}

export function useCalendarDashboard() {
    return useContext(CalendarDashboardContext);
}
