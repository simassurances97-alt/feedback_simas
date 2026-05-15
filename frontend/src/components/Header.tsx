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
          <img src="/logo.webp" alt="SIM Assurances Logo" style={{ height: '45px', objectFit: 'contain' }} />
          <div className="logo-text" style={{ marginLeft: '12px', paddingLeft: '12px', borderLeft: '2px solid rgba(255, 255, 255, 0.2)' }}>
            <span className="logo-title" style={{ fontSize: '1.2rem' }}>Feedback</span>
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
