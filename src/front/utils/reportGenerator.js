import jsPDF from "jspdf";

// Función para formatear números como moneda
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
};

// Función para obtener el nombre del mes
const getMonthName = (month) => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return months[month - 1];
};

// Función para formatear la fecha en español
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Función principal para generar y descargar el reporte PDF
export const downloadReport = (datos, periodo) => {
  const doc = new jsPDF();
  let y = 20;
  const lineHeight = 7;

  // Configuración de fuentes
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);

  // Título
  doc.text("REPORTE FINANCIERO", 105, y, { align: "center" });
  y += lineHeight * 2;

  // Período
  doc.setFontSize(12);
  const periodoText =
    periodo.tipo === "mes"
      ? `Período: ${getMonthName(periodo.mes)} ${periodo.año}`
      : `Período: Año ${periodo.año}`;
  doc.text(periodoText, 105, y, { align: "center" });
  y += lineHeight * 2;

  // Resumen Financiero
  doc.setFontSize(14);
  doc.text("Resumen Financiero", 20, y);
  y += lineHeight;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Ingresos: ${formatCurrency(datos.ingresos)}`, 30, y);
  y += lineHeight;
  doc.text(`Gastos: ${formatCurrency(datos.gastos)}`, 30, y);
  y += lineHeight;
  doc.text(`Balance: ${formatCurrency(datos.ingresos - datos.gastos)}`, 30, y);
  y += lineHeight * 2;

  // Transacciones
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Detalle de Transacciones", 20, y);
  y += lineHeight;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  // Encabezados de tabla
  doc.line(20, y, 190, y);
  y += 5;
  doc.text("Fecha", 20, y);
  doc.text("Tipo", 70, y);
  doc.text("Monto", 100, y);
  doc.text("Categoría", 130, y);
  doc.text("Detalle", 160, y);
  y += 2;
  doc.line(20, y, 190, y);
  y += lineHeight;

  // Contenido de la tabla
  doc.setFontSize(9);
  datos.transacciones.forEach((t) => {
    if (y > 270) {
      // Nueva página si no hay espacio
      doc.addPage();
      y = 20;
    }

    doc.text(formatDate(t.fecha), 20, y);
    doc.text(t.tipo === "ingreso" ? "Ingreso" : "Gasto", 70, y);
    doc.text(formatCurrency(t.monto), 100, y);
    doc.text(t.categoria || "-", 130, y);
    doc.text(t.detalle || "-", 160, y);
    y += lineHeight;
  });
  y += lineHeight;

  // Metas
  if (y > 250) {
    // Nueva página si no hay espacio suficiente
    doc.addPage();
    y = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Metas", 20, y);
  y += lineHeight;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  if (datos.metas.length === 0) {
    doc.text("No hay metas registradas", 30, y);
  } else {
    datos.metas.forEach((m) => {
      doc.text(`${m.cumplida ? "✓" : "○"} ${m.titulo}`, 30, y);
      y += lineHeight;
    });
  }

  // Configurar el nombre del archivo y descargar
  const periodoStr =
    periodo.tipo === "mes"
      ? `${getMonthName(periodo.mes)}_${periodo.año}`
      : `Año_${periodo.año}`;

  doc.save(`Reporte_${periodoStr}.pdf`);
};
