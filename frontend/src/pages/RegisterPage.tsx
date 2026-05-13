import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password });
      setMessage('Compte créé avec succès. Vous pouvez vous connecter.');
      navigate('/login');
    } catch (err) {
      setMessage('Impossible de créer le compte. Vérifiez les informations.');
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
              to="/login"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#004B9C',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      <h1>Inscription employé</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom complet</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Créer mon compte</button>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}

export default RegisterPage;
