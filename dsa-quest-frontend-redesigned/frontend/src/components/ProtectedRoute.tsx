import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3" style={{ background: "var(--bg)" }}>
        <div className="w-10 h-10 rounded-full border-4 border-quest-purple/20 border-t-quest-purple animate-spin" />
        <p className="text-lg font-display text-quest-purple">Loading your quest... 🎮</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
