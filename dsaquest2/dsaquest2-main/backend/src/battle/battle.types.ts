export type BattleStatus = 'waiting' | 'countdown' | 'active' | 'finished';
export type PlayerStatus = 'joined' | 'ready' | 'submitted';

export interface TestCase {
  input: unknown[];
  expected: unknown;
  description: string;
}

export interface BattleQuestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
  starterCode: string;
  functionName: string;
  testCases: TestCase[];
}

export interface PlayerSubmission {
  userId: string;
  code: string;
  language: string;
  submittedAt: number;    // epoch ms
  elapsedSeconds: number; // seconds since battle start
  testsPassed: number;
  totalTests: number;
  runtime: number;        // ms
  score: number;          // 0-100
}

export interface BattlePlayer {
  userId: string;
  username: string;
  avatar: string;
  socketId: string;
  status: PlayerStatus;
  submission?: PlayerSubmission;
}

export interface BattleRoom {
  id: string;
  playerA: BattlePlayer;
  playerB?: BattlePlayer;
  question?: BattleQuestion;
  status: BattleStatus;
  startTime?: number;  // epoch ms when battle became 'active'
  endTime?: number;
  winner?: string | null; // userId or null for draw
  createdAt: number;
}
