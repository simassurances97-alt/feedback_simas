import { useState, useEffect, FormEvent } from 'react';
import api from '../services/api';

interface EmployeeOption {
  id: string;
  name: string;
}

interface Props {
  onSubmit: () => void;
}

function FeedbackForm({ onSubmit }: Props) {
  const [recipientId, setRecipientId] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);

  useEffect(() => {
    api
      .get('/employees')
      .then((response) => setEmployees(response.data.employees))
      .catch(() => setEmployees([]));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    // Validation côté client
    if (content.length < 20 || content.length > 500) {
      setMessage('Le commentaire doit contenir entre 20 et 500 caractères.');
      setMessageType('error');
      return;
    }

    const spamWords = ['spam', 'test', 'fake', 'dummy'];
    const lowerContent = content.toLowerCase();
    if (spamWords.some(word => lowerContent.includes(word))) {
      setMessage('Le contenu contient des mots inappropriés.');
      setMessageType('error');
      return;
    }

    try {
      await api.post('/feedbacks/submit', { recipientId, content });
      setMessage('✓ Feedback envoyé avec succès ! Merci pour votre retour.');
      setMessageType('success');
      setContent('');
      setRecipientId('');
      setTimeout(onSubmit, 1000);
    } catch (error) {
      setMessage('Erreur lors de la soumission. Veuillez réessayer.');
      setMessageType('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-glass">
      {message && <p className={`message message-${messageType}`}>{message}</p>}

      <div className="form-group">
        <label htmlFor="recipient">À qui adresser ce commentaire ?</label>
        <select 
          id="recipient"
          value={recipientId} 
          onChange={(event) => setRecipientId(event.target.value)} 
          required
        >
          <option value="">Sélectionnez un employé</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="content">Votre commentaire constructif</label>
        <textarea
          id="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={5}
          required
          placeholder="Partagez vos pensées honnêtes et bienveillantes..."
          style={{ fontFamily: 'inherit' }}
        />
        <small style={{ display: 'block', marginTop: '8px', color: content.length < 20 || content.length > 500 ? '#FF3B30' : '#64748b' }}>
          {content.length}/500 caractères (minimum 20)
        </small>
      </div>

      <button type="submit" className="btn-primary">
        Envoyer mon avis
      </button>
    </form>
  );
}

export default FeedbackForm;

  );
}

export default FeedbackForm;
