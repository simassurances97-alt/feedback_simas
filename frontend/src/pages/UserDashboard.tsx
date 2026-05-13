import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';

function UserDashboard() {
  const [feedbacks, setFeedbacks] = useState<Array<{ id: string; content: string; submitted_at: string }>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('feedback_token');
    if (!token) {
      return;
    }
    setAuthToken(token);

    api.get('/user/me/feedbacks')
      .then((response) => setFeedbacks(response.data.feedbacks))
      .catch(console.error);
  }, []);

  function handleLogout() {
    localStorage.removeItem('feedback_token');
    setAuthToken('');
    navigate('/');
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
              Accueil public
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <h1>Mes feedbacks</h1>
      <p>Vous ne voyez que les retours qui vous sont destinés, sans information sur l'auteur.</p>
      <ul>
        {feedbacks.map((feedback) => (
          <li key={feedback.id} style={{ marginBottom: 16, padding: 12, border: '1px solid #ccc' }}>
            <p>{feedback.content}</p>
            <small>{feedback.submitted_at}</small>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default UserDashboard;
