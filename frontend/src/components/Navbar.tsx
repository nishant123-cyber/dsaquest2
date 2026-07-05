import { Link, useNavigate } from "react-router-dom";
import { LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white/70 backdrop-blur shadow-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-display font-extrabold text-quest-purple">
          <Sparkles className="w-6 h-6 text-quest-yellow" />
          DSA Quest
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-quest-yellow/20 px-3 py-1 rounded-full font-semibold text-sm">
              ⭐ {user.xp} XP · Lvl {user.level}
            </div>
            <span className="text-2xl">{user.avatar}</span>
            <span className="font-semibold hidden sm:inline">{user.name}</span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="p-2 rounded-full hover:bg-quest-pink/10 text-quest-pink transition"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
