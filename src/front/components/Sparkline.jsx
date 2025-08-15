import React from "react";
import PropTypes from "prop-types";

export default function Sparkline({ data = [], color = "#3b82f6", height = 40 }) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = ((max - val) / range) * height;
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="sparkline">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points.join(" ")}
      />
    </svg>
  );
}

Sparkline.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  color: PropTypes.string,
  height: PropTypes.number,
};