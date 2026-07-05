import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dsaquest_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface TopicSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  totalQuizzes: number;
  visualizerDone: boolean;
  quizBestScore: number;
}

export interface DashboardResponse {
  user: { name: string; avatar: string; xp: number; level: number };
  topics: TopicSummary[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}
