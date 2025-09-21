import React from "react";
import prismaLogo from "../../logo/prisma.png";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img
          src={prismaLogo}
          alt="Prisma"
          style={{
            height: "40px",
            width: "auto",
            marginRight: "12px"
          }}
        />
        <span style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          background: "linear-gradient(45deg, #00c6ff, #0072ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Prisma
        </span>
      </div>
      <ul className="navbar__links">
        <li>
          <NavLink to="/dashboard" className="navlink" activeclassname="active">
            <i className="fas fa-tachometer-alt nav-icon"></i> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/calendario" className="navlink" activeclassname="active">
            <i className="fas fa-calendar-alt nav-icon"></i> Calendario
          </NavLink>
        </li>
        <li>
          <NavLink to="/historial" className="navlink" activeclassname="active">
            <i className="fas fa-history nav-icon"></i> Historial
          </NavLink>
        </li>
        <li>
          <NavLink to="/metas" className="navlink" activeclassname="active">
            <i className="fas fa-bullseye nav-icon"></i> Metas
          </NavLink>
        </li>
        <li>
          <NavLink to="/reflexion" className="navlink" activeclassname="active">
            <i className="fas fa-lightbulb nav-icon"></i> Reflexión
          </NavLink>
        </li>
        <li>
          <NavLink to="/budgeting" className="navlink" activeclassname="active">
            <i className="fas fa-wallet nav-icon"></i> Presupuesto
          </NavLink>
        </li>
        <li>
          <NavLink to="/resumen" className="navlink" activeclassname="active">
            <i className="fas fa-chart-bar nav-icon"></i> Resumen
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;