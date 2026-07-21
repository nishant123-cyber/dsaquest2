import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

// ── Types ────────────────────────────────────────────────────────────────────

export type BattleStatus = 'waiting' | 'countdown' | 'active' | 'finished';
export type PlayerStatus = 'joined' | 'ready' | 'submitted';

export interface BattleQuestionFrontend {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
  starterCode: string;
  functionName: string;
  totalTestCases: number;
}

export interface PlayerInfo {
  userId: string;
  username: string;
  avatar: string;
  status: PlayerStatus;
  submission?: {
    testsPassed: number;
    totalTests: number;
    score: number;
    elapsedSeconds: number;
    runtime: number;
  };
}

export interface BattleRoom {
  id: string;
  status: BattleStatus;
  winner?: string | null;
  startTime?: number;
  endTime?: number;
  createdAt: number;
  playerA: PlayerInfo;
  playerB?: PlayerInfo;
  question?: BattleQuestionFrontend;
}

interface BattleContextValue {
  socket: Socket | null;
  connected: boolean;
  room: BattleRoom | null;
  countdownSeconds: number | null;
  opponentDisconnected: boolean;
  // Actions
  createRoom: () => Promise<{ error?: string }>;
  joinRoom: (roomId: string) => Promise<{ error?: string }>;
  setReady: () => Promise<{ error?: string }>;
  submitSolution: (code: string, language: string) => Promise<{ error?: string }>;
  leaveRoom: () => void;
}

const BattleContext = createContext<BattleContextValue | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────────────────────

const SOCKET_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace('/api', '') ||
  'http://localhost:4000';

export function BattleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState<BattleRoom | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  // Connect socket when user is authenticated
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('dsaquest_token');
    const socket = io(SOCKET_URL, {
      auth: { token, username: user.name, avatar: user.avatar },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('opponent_joined', ({ room }: { room: BattleRoom }) => {
      setRoom(room);
      setOpponentDisconnected(false);
    });

    socket.on('player_status_update', ({ room }: { room: BattleRoom }) => {
      setRoom(room);
    });

    socket.on('countdown_start', ({ seconds }: { seconds: number }) => {
      setCountdownSeconds(seconds);
      const interval = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on('battle_start', ({ room }: { room: BattleRoom }) => {
      setRoom(room);
      setCountdownSeconds(null);
    });

    socket.on(
      'opponent_submitted',
      ({ submission }: { submission: { userId: string; testsPassed: number; totalTests: number; score: number; elapsedSeconds: number; runtime: number } }) => {
        const { userId, ...submissionData } = submission;
        setRoom((prev) => {
          if (!prev) return prev;
          const updatedRoom = { ...prev };
          if (prev.playerA.userId === userId) {
            updatedRoom.playerA = { ...prev.playerA, status: 'submitted', submission: submissionData };
          } else if (prev.playerB?.userId === userId) {
            updatedRoom.playerB = { ...prev.playerB!, status: 'submitted', submission: submissionData };
          }
          return updatedRoom;
        });
      }
    );

    socket.on('battle_ended', ({ room }: { room: BattleRoom }) => {
      setRoom(room);
    });

    socket.on('opponent_disconnected', ({ room }: { room: BattleRoom }) => {
      setRoom(room);
      setOpponentDisconnected(true);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [user]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const createRoom = useCallback(async (): Promise<{ error?: string }> => {
    const socket = socketRef.current;
    if (!socket) return { error: 'Not connected' };

    return new Promise((resolve) => {
      socket.emit('create_room', (res: { room?: BattleRoom; error?: string }) => {
        if (res.error) return resolve({ error: res.error });
        setRoom(res.room!);
        setOpponentDisconnected(false);
        resolve({});
      });
    });
  }, []);

  const joinRoom = useCallback(async (roomId: string): Promise<{ error?: string }> => {
    const socket = socketRef.current;
    if (!socket) return { error: 'Not connected' };

    return new Promise((resolve) => {
      socket.emit('join_room', { roomId: roomId.toUpperCase() }, (res: { room?: BattleRoom; error?: string }) => {
        if (res.error) return resolve({ error: res.error });
        setRoom(res.room!);
        setOpponentDisconnected(false);
        resolve({});
      });
    });
  }, []);

  const setReady = useCallback(async (): Promise<{ error?: string }> => {
    const socket = socketRef.current;
    if (!socket || !room) return { error: 'Not in a room' };

    return new Promise((resolve) => {
      socket.emit('player_ready', { roomId: room.id }, (res: { room?: BattleRoom; error?: string }) => {
        if (res.error) return resolve({ error: res.error });
        setRoom(res.room!);
        resolve({});
      });
    });
  }, [room]);

  const submitSolution = useCallback(
    async (code: string, language: string): Promise<{ error?: string }> => {
      const socket = socketRef.current;
      if (!socket || !room) return { error: 'Not in a room' };

      return new Promise((resolve) => {
        socket.emit(
          'submit_solution',
          { roomId: room.id, code, language },
          (res: { submission?: PlayerInfo['submission']; room?: BattleRoom; error?: string }) => {
            if (res.error) return resolve({ error: res.error });
            setRoom(res.room!);
            resolve({});
          }
        );
      });
    },
    [room]
  );

  const leaveRoom = useCallback(() => {
    setRoom(null);
    setCountdownSeconds(null);
    setOpponentDisconnected(false);
  }, []);

  return (
    <BattleContext.Provider
      value={{
        socket: socketRef.current,
        connected,
        room,
        countdownSeconds,
        opponentDisconnected,
        createRoom,
        joinRoom,
        setReady,
        submitSolution,
        leaveRoom,
      }}
    >
      {children}
    </BattleContext.Provider>
  );
}

export function useBattle() {
  const ctx = useContext(BattleContext);
  if (!ctx) throw new Error('useBattle must be used within BattleProvider');
  return ctx;
}
