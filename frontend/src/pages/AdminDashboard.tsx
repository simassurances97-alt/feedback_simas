import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';

function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState<Array<{ id: string; content: string; recipient_id: string; submitted_at: string; is_moderated: boolean }>>([]);
  const [stats, setStats] = useState<{ total: number; moderated: number } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('feedback_token');
    if (!token) return;
    setAuthToken(token);

    api.get('/admin/feedbacks').then((response) => setFeedbacks(response.data.feedbacks)).catch(console.error);
    api.get('/admin/stats').then((response) => setStats(response.data)).catch(console.error);
  }, []);

  async function handleDelete(id: string) {
    await api.delete(`/admin/feedbacks/${id}`);
    setFeedbacks((current) => current.filter((item) => item.id !== id));
  }

  async function handleModerate(id: string, isModerated: boolean) {
    await api.put(`/admin/feedbacks/${id}/moderate`, { isModerated });
    setFeedbacks((current) =>
      current.map((item) =>
        item.id === id ? { ...item, is_moderated: isModerated } : item
      )
    );
  }

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

      <h1>Tableau de bord Admin</h1>
      {stats && (
        <div style={{ marginBottom: 20 }}>
          <p>Total commentaires : {stats.total}</p>
          <p>Commentaires modérés : {stats.moderated}</p>
        </div>
      )}
      <section>
        <h2>Commentaires</h2>
        <ul>
          {feedbacks.map((feedback) => (
            <li key={feedback.id} style={{ marginBottom: 16, padding: 12, border: '1px solid #ccc' }}>
              <p>{feedback.content}</p>
              <small>Destinataire : {feedback.recipient_id} - {feedback.submitted_at}</small>
              <div style={{ marginTop: 8 }}>
                <button
                  onClick={() => handleModerate(feedback.id, !feedback.is_moderated)}
                  style={{
                    marginRight: 8,
                    background: feedback.is_moderated ? '#10b981' : '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                >
                  {feedback.is_moderated ? 'Démondérer' : 'Modérer'}
                </button>
                <button
                  onClick={() => handleDelete(feedback.id)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default AdminDashboard;
