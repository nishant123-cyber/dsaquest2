import { createContext, useContext, useState, ReactNode } from "react";

export type BattlePhase = "lobby" | "waiting" | "battle" | "result";

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isReady: boolean;
  code: string;
  codeLanguage: string;
}

export interface BattleRoom {
  roomId: string;
  players: Player[];
  problem: BattleProblem;
  timeRemaining: number;
  winner: Player | null;
  phase: BattlePhase;
}

export interface BattleProblem {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  examples: { input: string; output: string; explanation: string }[];
  constraints: string[];
  starterCode: string;
  testCases: { input: string; expected: string }[];
}

interface BattleContextValue {
  room: BattleRoom | null;
  currentPlayer: Player | null;
  createRoom: (playerName: string, playerAvatar: string) => string;
  joinRoom: (roomId: string, playerName: string, playerAvatar: string) => boolean;
  setPlayerReady: (ready: boolean) => void;
  updatePlayerCode: (code: string, language: string) => void;
  startBattle: () => void;
  setTimeRemaining: (time: number) => void;
  submitSolution: (winner: Player) => void;
  resetBattle: () => void;
  leaveRoom: () => void;
}

const BattleContext = createContext<BattleContextValue | undefined>(undefined);

// Mock problems for the battle arena
const MOCK_PROBLEMS: BattleProblem[] = [
  {
    id: "p1",
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to the target. You may assume each input has exactly one solution, and you cannot use the same element twice.",
    difficulty: "easy",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "The numbers at index 0 and 1 add up to 9." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "The numbers at index 1 and 2 add up to 6." },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
    starterCode: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
    testCases: [
      { input: "[2,7,11,15], 9", expected: "[0,1]" },
      { input: "[3,2,4], 6", expected: "[1,2]" },
      { input: "[3,3], 6", expected: "[0,1]" },
    ],
  },
  {
    id: "p2",
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: (1) Open brackets must be closed by the same type of brackets, (2) Open brackets must be closed in the correct order.",
    difficulty: "easy",
    examples: [
      { input: "s = '()'", output: "true", explanation: "Parentheses are valid." },
      { input: "s = '()[]{}'", output: "true", explanation: "All types are valid and in correct order." },
      { input: "s = '(]'", output: "false", explanation: "Brackets are mismatched." },
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only"],
    starterCode: `function isValid(s) {
  // Write your solution here
  
}`,
    testCases: [
      { input: "()", expected: "true" },
      { input: "()[]{}", expected: "true" },
      { input: "(]", expected: "false" },
    ],
  },
  {
    id: "p3",
    title: "Merge Two Sorted Lists",
    description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the two lists. Return the head of the merged linked list.",
    difficulty: "easy",
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]", explanation: "All elements merged in sorted order." },
    ],
    constraints: ["0 <= Node.val <= 100", "Both lists are sorted"],
    starterCode: `function mergeTwoLists(list1, list2) {
  // Write your solution here
  
}`,
    testCases: [
      { input: "[1,2,4], [1,3,4]", expected: "[1,1,2,3,4,4]" },
    ],
  },
];

function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getRandomProblem(): BattleProblem {
  return MOCK_PROBLEMS[Math.floor(Math.random() * MOCK_PROBLEMS.length)];
}

export function BattleProvider({ children }: { children: ReactNode }) {
  const [room, setRoom] = useState<BattleRoom | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  function createRoom(playerName: string, playerAvatar: string): string {
    const roomId = generateRoomId();
    const newPlayer: Player = {
      id: Math.random().toString(36).substring(2, 9),
      name: playerName,
      avatar: playerAvatar,
      isReady: false,
      code: "",
      codeLanguage: "javascript",
    };

    const newRoom: BattleRoom = {
      roomId,
      players: [newPlayer],
      problem: getRandomProblem(),
      timeRemaining: 1200, // 20 minutes
      winner: null,
      phase: "lobby",
    };

    setRoom(newRoom);
    setCurrentPlayer(newPlayer);
    return roomId;
  }

  function joinRoom(roomId: string, playerName: string, playerAvatar: string): boolean {
    if (!room || room.roomId !== roomId) return false;
    if (room.players.length >= 2) return false;

    const newPlayer: Player = {
      id: Math.random().toString(36).substring(2, 9),
      name: playerName,
      avatar: playerAvatar,
      isReady: false,
      code: "",
      codeLanguage: "javascript",
    };

    setRoom((prev) => {
      if (!prev) return null;
      return { ...prev, players: [...prev.players, newPlayer] };
    });
    setCurrentPlayer(newPlayer);
    return true;
  }

  function setPlayerReady(ready: boolean) {
    if (!room || !currentPlayer) return;

    setRoom((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        players: prev.players.map((p) => (p.id === currentPlayer.id ? { ...p, isReady: ready } : p)),
      };
    });
  }

  function updatePlayerCode(code: string, language: string) {
    if (!room || !currentPlayer) return;

    setCurrentPlayer((prev) => {
      if (!prev) return null;
      return { ...prev, code, codeLanguage: language };
    });

    setRoom((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        players: prev.players.map((p) => (p.id === currentPlayer.id ? { ...p, code, codeLanguage: language } : p)),
      };
    });
  }

  function startBattle() {
    if (!room) return;
    setRoom((prev) => {
      if (!prev) return null;
      return { ...prev, phase: "battle", timeRemaining: 1200 };
    });
  }

  function setTimeRemaining(time: number) {
    if (!room) return;
    setRoom((prev) => {
      if (!prev) return null;
      return { ...prev, timeRemaining: time };
    });
  }

  function submitSolution(winner: Player) {
    if (!room) return;
    setRoom((prev) => {
      if (!prev) return null;
      return { ...prev, phase: "result", winner };
    });
  }

  function resetBattle() {
    if (!room || !currentPlayer) return;
    setRoom((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        phase: "lobby",
        timeRemaining: 1200,
        winner: null,
        players: prev.players.map((p) => ({ ...p, isReady: false, code: "", codeLanguage: "javascript" })),
      };
    });
  }

  function leaveRoom() {
    setRoom(null);
    setCurrentPlayer(null);
  }

  return (
    <BattleContext.Provider
      value={{
        room,
        currentPlayer,
        createRoom,
        joinRoom,
        setPlayerReady,
        updatePlayerCode,
        startBattle,
        setTimeRemaining,
        submitSolution,
        resetBattle,
        leaveRoom,
      }}
    >
      {children}
    </BattleContext.Provider>
  );
}

export function useBattle() {
  const ctx = useContext(BattleContext);
  if (!ctx) throw new Error("useBattle must be used within BattleProvider");
  return ctx;
}
