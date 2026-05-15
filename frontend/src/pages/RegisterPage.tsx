import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await api.post('/auth/register', { name, email, password });
      setMessage('✓ Compte créé avec succès ! Redirection vers la connexion...');
      setMessageType('success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage('Impossible de créer le compte. Vérifiez que l\'email n\'est pas déjà utilisé.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A1628 0%, #1B3A6B 50%, #0A1628 100%)' }}>
      <Header />

      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
        <form onSubmit={handleSubmit} className="form-glass" style={{ maxWidth: '450px' }}>
          <h2>Créer un compte</h2>

          {message && <p className={`message message-${messageType}`}>{message}</p>}

          <div className="form-group">
            <label htmlFor="name">Nom complet</label>
            <input 
              id="name"
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="Jean Dupont"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="votre.email@simasurances.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Création en cours...' : 'Créer mon compte'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '24px', color: '#64748b' }}>
            Vous avez déjà un compte ? <Link to="/login" style={{ color: '#00C896', fontWeight: 600 }}>Se connecter</Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default RegisterPage;

