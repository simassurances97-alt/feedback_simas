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
    return <p>Aucun commentaire pour le moment.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
      {feedbacks.map((item) => (
        <li key={item.id} style={{ marginBottom: 16, border: '1px solid #ddd', padding: 12 }}>
          <p>{item.content}</p>
          {item.recipient_name && <small>À : {item.recipient_name}</small>}
          <br />
          <small>{item.submitted_at}</small>
        </li>
      ))}
    </ul>
  );
}

export default FeedbackList;
