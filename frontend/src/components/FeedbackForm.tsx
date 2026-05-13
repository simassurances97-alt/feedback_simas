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
      return;
    }

    const spamWords = ['spam', 'test', 'fake', 'dummy'];
    const lowerContent = content.toLowerCase();
    if (spamWords.some(word => lowerContent.includes(word))) {
      setMessage('Le contenu contient des mots inappropriés.');
      return;
    }

    try {
      await api.post('/feedbacks/submit', { recipientId, content });
      setMessage('Feedback envoyé anonymement.');
      setContent('');
      onSubmit();
    } catch (error) {
      setMessage('Erreur lors de la soumission.');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <div>
        <label>Destinataire</label>
        <select value={recipientId} onChange={(event) => setRecipientId(event.target.value)} required>
          <option value="">Sélectionnez un employé</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Commentaire</label>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={5}
          required
          placeholder="Écrivez un commentaire constructif..."
        />
        <small style={{ color: content.length < 20 || content.length > 500 ? '#ef4444' : '#64748b' }}>
          {content.length}/500 caractères (minimum 20)
        </small>
      </div>
      <button type="submit">Envoyer</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default FeedbackForm;
