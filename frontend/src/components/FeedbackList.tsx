interface Feedback {
  id: string;
  content: string;
  submitted_at: string;
  recipient_name?: string;
}

interface FeedbackListProps {
  feedbacks: Feedback[];
}

function FeedbackList({ feedbacks }: FeedbackListProps) {
  if (feedbacks.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
        <p style={{ fontSize: '1.1rem', color: '#94a3b8' }}>Aucun commentaire pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="card-grid">
      {feedbacks.map((item) => (
        <div key={item.id} className="card" style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: '#0f172a', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 16px 0', minHeight: '80px' }}>
              "{item.content}"
            </p>
          </div>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: 'auto' }}>
            {item.recipient_name && (
              <small style={{ color: '#00C896', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                ✓ Pour {item.recipient_name}
              </small>
            )}
            <small style={{ color: '#94a3b8' }}>
              {new Date(item.submitted_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeedbackList;

