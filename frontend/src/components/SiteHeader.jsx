import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import brandLogo from '../assets/brand-logo-optimized.png';

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="header-shell">
        <Link className="brand-block" to="/">
          <div className="brand-identity">
            <div className="brand-logo-shell">
              <img alt="Logo Medicina China" className="brand-logo" src={brandLogo} />
            </div>
            <div>
              <p className="brand-mark">Medicina China</p>
              <span className="brand-subtitle">Terapias, ritual y bienestar</span>
            </div>
          </div>
        </Link>

        <button
          aria-controls="site-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen((current) => !current)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`} id="site-navigation">
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/terapias">Terapias</NavLink>
          <NavLink to="/talleres">Talleres</NavLink>
          <NavLink to="/formaciones">Formaciones</NavLink>
          <NavLink to="/productos">Productos</NavLink>
          <NavLink to="/contacto">Contacto</NavLink>
        </nav>
      </div>
    </header>
  );
}
