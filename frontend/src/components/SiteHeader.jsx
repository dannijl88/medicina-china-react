import { Link, NavLink } from 'react-router-dom';
import brandLogo from '../assets/brand-logo-optimized.png';

export function SiteHeader({ isLoggedIn }) {
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

        <nav className="nav-links">
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/terapias">Terapias</NavLink>
          <NavLink to="/talleres">Talleres</NavLink>
          <NavLink to="/productos">Productos</NavLink>
          <NavLink to="/citas">Citas</NavLink>
          <NavLink to="/contacto">Contacto</NavLink>
          <NavLink to="/login">{isLoggedIn ? 'Mi espacio' : 'Login'}</NavLink>
        </nav>
      </div>
    </header>
  );
}
