import { Link } from 'react-router-dom';

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <p className="brand-mark">Medicina China</p>
        <span>Calma, presencia y ritual contemporaneo</span>
      </div>
      <div className="footer-links">
        <Link to="/aviso-legal">Aviso legal</Link>
        <Link to="/privacidad">Privacidad</Link>
        <Link to="/cookies">Cookies</Link>
      </div>
    </footer>
  );
}
