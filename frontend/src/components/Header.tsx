import { Link, useLocation } from 'react-router-dom';
import '../styles/header.css';

interface HeaderProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

function Header({ isAuthenticated = false, onLogout }: HeaderProps) {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">📋</span>
          <div className="logo-text">
            <span className="logo-title">SIM Assurances</span>
            <span className="logo-subtitle">Feedback</span>
          </div>
        </Link>

        <nav className="nav-menu">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Accueil
          </Link>

          {!isAuthenticated && (
            <>
              <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
                Connexion
              </Link>
              <Link to="/register" className="btn btn-green">
                Inscription
              </Link>
            </>
          )}

          {isAuthenticated && (
            <>
              <Link
                to={isAdmin ? '/admin' : '/user/me'}
                className={`nav-link ${location.pathname === (isAdmin ? '/admin' : '/user/me') ? 'active' : ''}`}
              >
                {isAdmin ? 'Dashboard Admin' : 'Mon Dashboard'}
              </Link>
              <button onClick={handleLogout} className="btn btn-logout">
                Déconnexion
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
