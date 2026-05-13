import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';
import api from '../services/api';

function PublicPage() {
  const [feedbacks, setFeedbacks] = useState<Array<{ id: string; content: string; submitted_at: string; recipient_name: string }>>([]);

  useEffect(() => {
    api.get('/feedbacks/public').then((response) => setFeedbacks(response.data.feedbacks)).catch(console.error);
  }, []);

  return (
    <main>
      <nav style={{ marginBottom: '2rem', padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, color: '#004B9C' }}>SIM Assurances - Feedback</h1>
          <div>
            <Link
              to="/login"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#004B9C',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                marginRight: '0.5rem'
              }}
            >
              Connexion employé
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

      <h1>Feedback anonyme public</h1>
      <p>Soumettez un avis constructif sans inscription.</p>
      <FeedbackForm onSubmit={() => window.location.reload()} />
      <h2>Commentaires publics</h2>
      <FeedbackList feedbacks={feedbacks} />
    </main>
  );
}

export default PublicPage;
