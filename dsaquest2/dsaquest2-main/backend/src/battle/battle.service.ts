import vm from 'vm';
import crypto from 'crypto';
import { BattleRoom, BattlePlayer, PlayerSubmission, BattleQuestion } from './battle.types';
import { getRoom, setRoom, deleteRoom, getRoomBySocketId } from './battle.store';
import { pickRandomQuestion } from './battle.questions';

// ── Room ID generation ────────────────────────────────────────────────────────

function generateRoomId(): string {
  return crypto.randomBytes(3).toString('hex').toUpperCase(); // 6-char hex e.g. "A3F7C2"
}

// ── Room lifecycle ────────────────────────────────────────────────────────────

export function createRoom(player: Omit<BattlePlayer, 'status'>): BattleRoom {
  const id = generateRoomId();
  const room: BattleRoom = {
    id,
    playerA: { ...player, status: 'joined' },
    status: 'waiting',
    createdAt: Date.now(),
  };
  setRoom(id, room);

  // Auto-clean room after 30 minutes
  setTimeout(() => deleteRoom(id), 30 * 60 * 1000);

  return room;
}

export function joinRoom(
  roomId: string,
  player: Omit<BattlePlayer, 'status'>
): { room: BattleRoom; error?: never } | { room?: never; error: string } {
  const room = getRoom(roomId);
  if (!room) return { error: 'Room not found. Check the Room ID and try again.' };
  if (room.playerB) return { error: 'Room is already full.' };
  if (room.status !== 'waiting') return { error: 'Battle has already started.' };
  if (room.playerA.userId === player.userId) return { error: 'You cannot battle yourself.' };

  room.playerB = { ...player, status: 'joined' };
  setRoom(roomId, room);
  return { room };
}

export function setPlayerReady(
  roomId: string,
  userId: string
): { room: BattleRoom; bothReady: boolean } | { error: string } {
  const room = getRoom(roomId);
  if (!room) return { error: 'Room not found' };

  if (room.playerA.userId === userId) {
    room.playerA.status = 'ready';
  } else if (room.playerB?.userId === userId) {
    room.playerB.status = 'ready';
  } else {
    return { error: 'Player not in this room' };
  }

  const bothReady = room.playerA.status === 'ready' && room.playerB?.status === 'ready';
  if (bothReady) {
    room.status = 'countdown';
    room.question = pickRandomQuestion();
  }

  setRoom(roomId, room);
  return { room, bothReady };
}

export function startBattle(roomId: string): BattleRoom | null {
  const room = getRoom(roomId);
  if (!room) return null;

  room.status = 'active';
  room.startTime = Date.now();
  setRoom(roomId, room);
  return room;
}

// ── Code evaluation ───────────────────────────────────────────────────────────

function runTestCases(
  code: string,
  question: BattleQuestion
): { testsPassed: number; totalTests: number; runtime: number } {
  const totalTests = question.testCases.length;
  let testsPassed = 0;
  const startTime = Date.now();

  for (const testCase of question.testCases) {
    try {
      const sandbox: Record<string, unknown> = { __result__: undefined };
      const script = new vm.Script(
        `${code}\n__result__ = ${question.functionName}(...${JSON.stringify(testCase.input)});`
      );
      const context = vm.createContext(sandbox);
      script.runInContext(context, { timeout: 2000 });

      const got = JSON.stringify(context['__result__']);
      const want = JSON.stringify(testCase.expected);

      // For array results, also try sorted comparison (e.g. twoSum returns any order)
      if (got === want) {
        testsPassed++;
      } else if (Array.isArray(context['__result__']) && Array.isArray(testCase.expected)) {
        const sortedGot = [...(context['__result__'] as unknown[])].sort((a, b) => String(a).localeCompare(String(b)));
        const sortedWant = [...(testCase.expected as unknown[])].sort((a, b) => String(a).localeCompare(String(b)));
        if (JSON.stringify(sortedGot) === JSON.stringify(sortedWant)) testsPassed++;
      }
    } catch {
      // test failed — runtime error or timeout
    }
  }

  return { testsPassed, totalTests, runtime: Date.now() - startTime };
}

export function submitSolution(
  roomId: string,
  userId: string,
  code: string,
  language: string
): { submission: PlayerSubmission; room: BattleRoom; battleEnded: boolean } | { error: string } {
  const room = getRoom(roomId);
  if (!room) return { error: 'Room not found' };
  if (room.status !== 'active') return { error: 'Battle is not active' };
  if (!room.question) return { error: 'No question assigned' };

  const isPlayerA = room.playerA.userId === userId;
  const isPlayerB = room.playerB?.userId === userId;
  if (!isPlayerA && !isPlayerB) return { error: 'Player not in this room' };

  const player = isPlayerA ? room.playerA : room.playerB!;
  if (player.status === 'submitted') return { error: 'Already submitted' };

  const elapsedSeconds = room.startTime ? Math.round((Date.now() - room.startTime) / 1000) : 0;
  const { testsPassed, totalTests, runtime } = runTestCases(code, room.question);
  const score = Math.round((testsPassed / totalTests) * 100);

  const submission: PlayerSubmission = {
    userId,
    code,
    language,
    submittedAt: Date.now(),
    elapsedSeconds,
    testsPassed,
    totalTests,
    runtime,
    score,
  };

  player.status = 'submitted';
  player.submission = submission;

  const battleEnded =
    room.playerA.status === 'submitted' && room.playerB?.status === 'submitted';

  if (battleEnded) {
    room.status = 'finished';
    room.endTime = Date.now();
    room.winner = determineWinner(room);
  }

  setRoom(roomId, room);
  return { submission, room, battleEnded };
}

function determineWinner(room: BattleRoom): string | null {
  const a = room.playerA.submission;
  const b = room.playerB?.submission;
  if (!a || !b) return room.playerA.submission ? room.playerA.userId : (room.playerB?.userId ?? null);

  if (a.testsPassed !== b.testsPassed) {
    return a.testsPassed > b.testsPassed ? room.playerA.userId : room.playerB!.userId;
  }
  // Tie-break: earlier submission wins
  if (a.elapsedSeconds !== b.elapsedSeconds) {
    return a.elapsedSeconds < b.elapsedSeconds ? room.playerA.userId : room.playerB!.userId;
  }
  return null; // true draw
}

export function handleDisconnect(socketId: string): { room: BattleRoom; disconnectedUserId: string } | null {
  const room = getRoomBySocketId(socketId);
  if (!room) return null;

  const isPlayerA = room.playerA.socketId === socketId;
  const disconnectedUserId = isPlayerA ? room.playerA.userId : room.playerB!.userId;

  // If battle was active or waiting for second player, end the room
  if (room.status === 'active') {
    room.status = 'finished';
    room.endTime = Date.now();
    // Winner is the player who stayed
    room.winner = isPlayerA ? room.playerB?.userId ?? null : room.playerA.userId;
    setRoom(room.id, room);
  }

  return { room, disconnectedUserId };
}

export function getRoom_(id: string): BattleRoom | undefined {
  return getRoom(id);
}
