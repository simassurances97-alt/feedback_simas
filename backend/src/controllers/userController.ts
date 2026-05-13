import { Request, Response } from 'express';
import { query } from '../utils/db';

export async function getUserFeedbacks(_req: Request, res: Response) {
  const sessionUser = res.locals.user;
  if (!sessionUser) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const result = await query(
    'SELECT id, content, submitted_at, source FROM feedbacks WHERE recipient_id = $1 AND is_moderated = FALSE ORDER BY submitted_at DESC',
    [sessionUser.userId]
  );
  return res.json({ feedbacks: result.rows });
}
