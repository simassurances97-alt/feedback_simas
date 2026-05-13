import { Router } from 'express';
import { authGuardUser } from '../middleware/auth';
import { getUserFeedbacks } from '../controllers/userController';

const router = Router();

router.get('/me/feedbacks', authGuardUser, getUserFeedbacks);

export default router;
