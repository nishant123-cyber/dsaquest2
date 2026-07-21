import 'express-async-errors';
import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';

import authRoutes from './routes/auth.routes';
import progressRoutes from './routes/progress.routes';
import quizRoutes from './routes/quiz.routes';
import battleRoutes from './battle/battle.routes';
import { registerBattleSocket } from './battle/battle.socket';

const app = express();
const server = http.createServer(app);

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Socket.IO — same CORS origin as REST
const io = new SocketIOServer(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

// ── REST routes ───────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/battle', battleRoutes);

// ── Socket.IO ─────────────────────────────────────────────────────────────────
registerBattleSocket(io);

// ── Central error handler ─────────────────────────────────────────────────────
app.use((err: Error & { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong' });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 DSA Quest API running on http://localhost:${PORT}`));
