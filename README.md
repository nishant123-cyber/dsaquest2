# DSA Quest 🚀

A fun, interactive DSA learning platform for Class 8 students. Learn Arrays, Stacks,
and Queues through visual metaphors (lockers, pancakes, canteen lines), then test
yourself with quizzes and earn XP.

## Stack & reused libraries

| Concern | Library / Pattern reused |
|---|---|
| DB ORM & migrations | Prisma |
| Auth | bcryptjs + jsonwebtoken (standard JWT boilerplate pattern) |
| API structure | Express + express-async-errors |
| Validation | zod |
| Frontend scaffold | Vite `react-ts` template |
| Styling | Tailwind CSS |
| Forms | react-hook-form + @hookform/resolvers/zod |
| Routing | react-router-dom |
| Animations | framer-motion |
| Icons | lucide-react |
| Charts | recharts |
| Celebration effect | canvas-confetti |
| Toasts | sonner |
| HTTP client | axios |

**Custom/original code** (the unique product): the 3 DSA visualizers (Array/Stack/Queue),
the quiz engine, XP/leveling logic, and seed content written for Class 8 students.

## Setup

### 1. Database
```bash
docker compose up -d
```

### 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run prisma:migrate
npm run seed
npm run dev
```
API runs at http://localhost:4000

### 3. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
App runs at http://localhost:5173

## Flow
1. Sign up → land on Dashboard (3 topic cards + XP/level + progress chart)
2. Click "Learn" → interactive visualizer (drag-free, click-based for touch friendliness)
3. Click "Quiz" → 4 multiple-choice questions → score + XP on pass (≥75%)
4. XP levels you up every 100 points, shown live in the navbar

## Notes for scaling past MVP
- Add more topics by inserting rows into `Topic`/`Quiz` via `seed.ts`.
- Visualizer routes are currently one page per topic (3 topics) — for more topics,
  refactor into a single dynamic `/visualizer/:slug` page with a strategy map.
- Add refresh tokens / httpOnly cookies before production (current MVP uses
  localStorage JWT for simplicity).
