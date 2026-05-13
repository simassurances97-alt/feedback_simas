import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, role } = response.data;
      localStorage.setItem('feedback_token', token);
      setAuthToken(token);
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user/me');
      }
    } catch (err) {
      setError('Identifiants invalides');
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <nav style={{ marginBottom: '2rem', padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#004B9C', fontWeight: 'bold' }}>
            SIM Assurances - Feedback
          </Link>
          <div>
            <Link
              to="/"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                color: '#004B9C',
                textDecoration: 'none',
                borderRadius: '4px',
                marginRight: '0.5rem'
              }}
            >
              Accueil
            </Link>
            <Link
              to="/register"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#51AEE2',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              Inscription
            </Link>
          </div>
        </div>
      </nav>

      <h1>Connexion employé</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Se connecter</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p>
        Pas encore de compte ? <Link to="/register">Inscription</Link>
      </p>
    </main>
  );
}

export default LoginPage;
