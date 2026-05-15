import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api, { setAuthToken } from '../services/api';

function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState<Array<{ id: string; content: string; recipient_id: string; recipient_name?: string; submitted_at: string; is_moderated: boolean }>>([]);
  const [stats, setStats] = useState<{ total: number; moderated: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('feedback_token');
    if (!token) {
      navigate('/login');
      return;
    }
    setAuthToken(token);

    Promise.all([
      api.get('/admin/feedbacks').then((response) => setFeedbacks(response.data.feedbacks)),
      api.get('/admin/stats').then((response) => setStats(response.data))
    ]).catch(console.error)
      .finally(() => setIsLoading(false));
  }, [navigate]);

  async function handleDelete(id: string) {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return;
    try {
      await api.delete(`/admin/feedbacks/${id}`);
      setFeedbacks((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }

  async function handleModerate(id: string, isModerated: boolean) {
    try {
      await api.put(`/admin/feedbacks/${id}/moderate`, { isModerated });
      setFeedbacks((current) =>
        current.map((item) =>
          item.id === id ? { ...item, is_moderated: isModerated } : item
        )
      );
    } catch (error) {
      console.error('Erreur lors de la modération:', error);
    }
  }

  function handleLogout() {
    localStorage.removeItem('feedback_token');
    setAuthToken('');
    navigate('/');
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A1628 0%, #1B3A6B 50%, #0A1628 100%)' }}>
      <Header isAuthenticated={true} onLogout={handleLogout} />

      <main>
        {/* Hero Section */}
        <section className="hero" style={{ marginBottom: '50px' }}>
          <div className="hero-content">
            <h1>Tableau de bord <span>Admin</span></h1>
            <p>Gérez et modérez tous les commentaires de la plateforme</p>
          </div>
        </section>

        {/* Stats Cards */}
        {stats && (
          <div className="card-grid" style={{ marginBottom: '40px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Commentaires</p>
              <h3 style={{ margin: '0', color: '#00C896', fontSize: '2.5rem', fontWeight: 800 }}>{stats.total}</h3>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Modérés</p>
              <h3 style={{ margin: '0', color: '#51AEE2', fontSize: '2.5rem', fontWeight: 800 }}>{stats.moderated}</h3>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Non Modérés</p>
              <h3 style={{ margin: '0', color: '#FF9500', fontSize: '2.5rem', fontWeight: 800 }}>{stats.total - stats.moderated}</h3>
            </div>
          </div>
        )}

        {/* Feedbacks List */}
        <section>
          <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 800, marginBottom: '10px' }}>Tous les commentaires</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem', marginBottom: '30px' }}>
            {isLoading ? 'Chargement...' : `${feedbacks.length} commentaire(s) à modérer`}
          </p>

          {isLoading ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <p>Chargement des commentaires...</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <p style={{ fontSize: '1.1rem', color: '#94a3b8' }}>Aucun commentaire pour le moment.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="card" style={{ borderLeft: feedback.is_moderated ? '4px solid #34C759' : '4px solid #FF9500' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#0f172a', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 12px 0' }}>
                        "{feedback.content}"
                      </p>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.9rem' }}>
                        <span style={{ color: '#00C896', fontWeight: 600 }}>
                          📍 {feedback.recipient_name || 'Employé inconnu'}
                        </span>
                        <span style={{ color: '#94a3b8' }}>
                          📅 {new Date(feedback.submitted_at).toLocaleDateString('fr-FR')}
                        </span>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          backgroundColor: feedback.is_moderated ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 149, 0, 0.1)',
                          color: feedback.is_moderated ? '#34C759' : '#FF9500',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}>
                          {feedback.is_moderated ? '✓ Modéré' : '⚠ Non modéré'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '16px' }}>
                    <button
                      onClick={() => handleModerate(feedback.id, !feedback.is_moderated)}
                      className={feedback.is_moderated ? 'btn-secondary' : 'btn-success'}
                      style={{
                        background: feedback.is_moderated ? 'rgba(52, 199, 89, 0.15)' : 'rgba(52, 199, 89, 0.15)',
                        color: feedback.is_moderated ? '#34C759' : '#34C759',
                        border: `1.5px solid ${feedback.is_moderated ? '#34C759' : '#34C759'}`,
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {feedback.is_moderated ? '↩ Démodérer' : '✓ Modérer'}
                    </button>
                    <button
                      onClick={() => handleDelete(feedback.id)}
                      className="btn-danger"
                      style={{
                        background: 'rgba(255, 59, 48, 0.15)',
                        color: '#FF3B30',
                        border: '1.5px solid #FF3B30',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      🗑 Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AdminDashboard;

