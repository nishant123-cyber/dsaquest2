import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getRoomInfo } from './battle.controller';

const router = Router();

// REST endpoint to check if a room exists before joining via socket
router.get('/room/:roomId', requireAuth, getRoomInfo);

export default router;
