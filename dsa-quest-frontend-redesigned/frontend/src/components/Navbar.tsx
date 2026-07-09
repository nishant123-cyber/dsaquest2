import { Link, useNavigate } from "react-router-dom";
import { LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import StreakWidget from "./StreakWidget";
import XPRing from "./XPRing";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav
      className="w-full sticky top-0 z-20 backdrop-blur-md border-b"
      style={{ background: "color-mix(in srgb, var(--surface) 80%, transparent)", borderColor: "var(--border)" }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3 gap-3">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-xl font-display font-extrabold text-quest-purple shrink-0"
        >
          <Sparkles className="w-6 h-6 text-quest-yellow" />
          <span>DSA Quest</span>
        </Link>

        {user && (
          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="hidden md:block">
              <StreakWidget />
            </div>

            <div
              className="hidden sm:flex items-center gap-2 rounded-full px-3 py-1.5 font-data text-sm font-bold"
              style={{ background: "rgba(245, 158, 11, 0.14)", color: "#92400E" }}
            >
              <span>{user.xp} XP</span>
            </div>

            <XPRing xp={user.xp} level={user.level} size={40} strokeWidth={4} />

            <div className="hidden lg:flex items-center gap-1.5 pl-1">
              <span className="text-xl leading-none">{user.avatar}</span>
              <span className="font-semibold text-sm">{user.name}</span>
            </div>

            <div className="w-px h-6 mx-0.5" style={{ background: "var(--border)" }} />

            <SoundToggle />
            <ThemeToggle />

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="p-2 rounded-full hover:bg-quest-pink/10 text-quest-pink transition"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
