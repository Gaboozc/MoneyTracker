import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">Atlas Finances</div>
      <ul className="navbar__links">
        <li>
          <NavLink to="/dashboard" className="navlink" activeclassname="active">
            <i className="fas fa-tachometer-alt nav-icon"></i> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/cierre-anual" className="navlink" activeclassname="active">
            <i className="fas fa-calendar-check nav-icon"></i> Cierre Anual
          </NavLink>
        </li>
        <li>
          <NavLink to="/exportar" className="navlink" activeclassname="active">
            <i className="fas fa-file-export nav-icon"></i> Exportar
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
            <i className="fas fa-comment-dots nav-icon"></i> Reflexión
          </NavLink>
        </li>
        <li>
          <NavLink to="/calendario" className="navlink" activeclassname="active">
            <i className="fas fa-calendar-alt nav-icon"></i> Calendario
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;