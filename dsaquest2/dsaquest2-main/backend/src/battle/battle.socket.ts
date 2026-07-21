import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt';
import {
  createRoom,
  joinRoom,
  setPlayerReady,
  startBattle,
  submitSolution,
  handleDisconnect,
  getRoom_,
} from './battle.service';

// Attach all battle Socket.IO handlers to the io server
export function registerBattleSocket(io: Server): void {
  io.on('connection', (socket: Socket) => {
    // ── Authenticate via handshake ──────────────────────────────────────────
    const token = socket.handshake.auth?.token as string | undefined;
    let userId: string | null = null;
    let username: string | null = null;
    let avatar: string | null = null;

    if (token) {
      try {
        const payload = verifyToken(token);
        userId = payload.userId;
        // Extra user info passed in auth
        username = (socket.handshake.auth?.username as string) || 'Player';
        avatar = (socket.handshake.auth?.avatar as string) || '🦸';
      } catch {
        // Invalid token — user can still connect but cannot create/join rooms
      }
    }

    // ── create_room ─────────────────────────────────────────────────────────
    socket.on('create_room', (callback: (res: unknown) => void) => {
      if (!userId) return callback({ error: 'Not authenticated' });

      const room = createRoom({
        userId,
        username: username!,
        avatar: avatar!,
        socketId: socket.id,
      });

      socket.join(room.id);
      callback({ room: sanitizeRoom(room) });
    });

    // ── join_room ────────────────────────────────────────────────────────────
    socket.on('join_room', (data: { roomId: string }, callback: (res: unknown) => void) => {
      if (!userId) return callback({ error: 'Not authenticated' });

      const result = joinRoom(data.roomId, {
        userId,
        username: username!,
        avatar: avatar!,
        socketId: socket.id,
      });

      if ('error' in result) {
        return callback({ error: result.error });
      }

      socket.join(data.roomId);
      callback({ room: sanitizeRoom(result.room) });

      // Notify playerA
      socket.to(data.roomId).emit('opponent_joined', {
        room: sanitizeRoom(result.room),
        opponent: sanitizePlayer(result.room.playerB!),
      });
    });

    // ── player_ready ─────────────────────────────────────────────────────────
    socket.on('player_ready', (data: { roomId: string }, callback: (res: unknown) => void) => {
      if (!userId) return callback({ error: 'Not authenticated' });

      const result = setPlayerReady(data.roomId, userId);
      if ('error' in result) return callback({ error: result.error });

      callback({ room: sanitizeRoom(result.room) });

      // Tell the other player someone is ready
      socket.to(data.roomId).emit('player_status_update', {
        room: sanitizeRoom(result.room),
      });

      if (result.bothReady) {
        // Send 5-second countdown, then start battle
        io.to(data.roomId).emit('countdown_start', { seconds: 5 });

        setTimeout(() => {
          const activeRoom = startBattle(data.roomId);
          if (activeRoom) {
            io.to(data.roomId).emit('battle_start', {
              room: sanitizeRoom(activeRoom),
              question: activeRoom.question,
              startTime: activeRoom.startTime,
            });
          }
        }, 5000);
      }
    });

    // ── submit_solution ───────────────────────────────────────────────────────
    socket.on(
      'submit_solution',
      (
        data: { roomId: string; code: string; language: string },
        callback: (res: unknown) => void
      ) => {
        if (!userId) return callback({ error: 'Not authenticated' });

        const result = submitSolution(data.roomId, userId, data.code, data.language);
        if ('error' in result) return callback({ error: result.error });

        // Acknowledge to the submitter
        callback({
          submission: result.submission,
          room: sanitizeRoom(result.room),
        });

        // Notify opponent about submission (don't expose the code)
        const opponentSubmission = {
          userId: result.submission.userId,
          testsPassed: result.submission.testsPassed,
          totalTests: result.submission.totalTests,
          score: result.submission.score,
          elapsedSeconds: result.submission.elapsedSeconds,
          runtime: result.submission.runtime,
        };
        socket.to(data.roomId).emit('opponent_submitted', { submission: opponentSubmission });

        // If battle ended, broadcast results to both
        if (result.battleEnded) {
          io.to(data.roomId).emit('battle_ended', {
            room: sanitizeRoom(result.room),
            winner: result.room.winner,
          });
        }
      }
    );

    // ── get_room ─────────────────────────────────────────────────────────────
    socket.on('get_room', (data: { roomId: string }, callback: (res: unknown) => void) => {
      const room = getRoom_(data.roomId);
      if (!room) return callback({ error: 'Room not found' });
      callback({ room: sanitizeRoom(room) });
    });

    // ── disconnect ────────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      const result = handleDisconnect(socket.id);
      if (result) {
        socket.to(result.room.id).emit('opponent_disconnected', {
          room: sanitizeRoom(result.room),
          disconnectedUserId: result.disconnectedUserId,
        });
      }
    });
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function sanitizePlayer(player: import('./battle.types').BattlePlayer) {
  return {
    userId: player.userId,
    username: player.username,
    avatar: player.avatar,
    status: player.status,
    submission: player.submission
      ? {
          testsPassed: player.submission.testsPassed,
          totalTests: player.submission.totalTests,
          score: player.submission.score,
          elapsedSeconds: player.submission.elapsedSeconds,
          runtime: player.submission.runtime,
        }
      : undefined,
  };
}

function sanitizeRoom(room: import('./battle.types').BattleRoom) {
  return {
    id: room.id,
    status: room.status,
    winner: room.winner,
    startTime: room.startTime,
    endTime: room.endTime,
    createdAt: room.createdAt,
    playerA: sanitizePlayer(room.playerA),
    playerB: room.playerB ? sanitizePlayer(room.playerB) : undefined,
    question: room.question
      ? {
          id: room.question.id,
          title: room.question.title,
          difficulty: room.question.difficulty,
          description: room.question.description,
          examples: room.question.examples,
          constraints: room.question.constraints,
          starterCode: room.question.starterCode,
          functionName: room.question.functionName,
          totalTestCases: room.question.testCases.length,
        }
      : undefined,
  };
}
