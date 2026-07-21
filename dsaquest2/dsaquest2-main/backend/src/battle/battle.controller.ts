import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getRoom_ } from './battle.service';

export async function getRoomInfo(req: AuthRequest, res: Response) {
  const { roomId } = req.params;
  const room = getRoom_(roomId.toUpperCase());
  if (!room) return res.status(404).json({ error: 'Room not found' });

  if (room.playerB) return res.status(409).json({ error: 'Room is already full' });
  if (room.status !== 'waiting') return res.status(409).json({ error: 'Battle has already started' });

  res.json({
    roomId: room.id,
    createdAt: room.createdAt,
    host: {
      username: room.playerA.username,
      avatar: room.playerA.avatar,
    },
  });
}
