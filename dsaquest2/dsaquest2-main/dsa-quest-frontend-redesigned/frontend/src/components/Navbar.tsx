import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Flame } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import StreakWidget from "./StreakWidget";

// Routes that exist today vs. sections planned for later phases of the
// redesign (Explore / Problems / Contest / Profile). Keeping the disabled
// ones visible (not hidden) matches the target nav structure, but they
// don't navigate anywhere until those pages are built.
const NAV_LINKS: { label: string; to: string; enabled: boolean }[] = [
  { label: "Explore", to: "/dashboard", enabled: false },
  { label: "Learn", to: "/dashboard", enabled: true },
  { label: "Problems", to: "/dashboard", enabled: false },
  { label: "Contest", to: "/dashboard", enabled: false },
  { label: "Battle Arena", to: "/battle", enabled: true },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function isActive(to: string, label: string) {
    if (label === "Battle Arena") return location.pathname.startsWith("/battle");
    if (label === "Learn") return location.pathname === "/dashboard" || location.pathname.startsWith("/visualizer") || location.pathname.startsWith("/quiz");
    return location.pathname === to;
  }

  return (
    <nav
      className="w-full sticky top-0 z-20 border-b"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="max-w-[1280px] mx-auto flex items-center h-12 px-4 gap-1">
        <Link to="/dashboard" className="flex items-center gap-2 pr-3 mr-1 shrink-0">
          <span
            className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: "#E8790C" }}
          >
            D
          </span>
          <span className="text-[15px] font-semibold tracking-tight" style={{ color: "var(--text)" }}>
            DSA Quest
          </span>
        </Link>

        {user && (
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) =>
              link.enabled ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`lc-navlink ${isActive(link.to, link.label) ? "active" : ""}`}
                  style={isActive(link.to, link.label) ? { background: "var(--surface-2)" } : undefined}
                >
                  {link.label}
                </Link>
              ) : (
                <span
                  key={link.label}
                  className="lc-navlink cursor-default select-none"
                  style={{ opacity: 0.45 }}
                  title="Coming soon"
                >
                  {link.label}
                </span>
              )
            )}
          </div>
        )}

        {user && (
          <div className="flex items-center gap-1 ml-auto">
            <div className="hidden lg:block">
              <StreakWidget />
            </div>

            <div
              className="hidden sm:flex items-center gap-1 lc-tag font-medium"
              style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
            >
              <Flame className="w-3 h-3" style={{ color: "#E8790C" }} />
              {user.xp} XP
            </div>

            <div
              className="hidden sm:flex items-center justify-center w-7 h-7 rounded-md text-[11px] font-semibold shrink-0"
              style={{ background: "var(--surface-2)", color: "var(--text)" }}
              title={`Level ${user.level}`}
            >
              L{user.level}
            </div>

            <div className="w-px h-5 mx-1" style={{ background: "var(--border)" }} />

            <SoundToggle />
            <ThemeToggle />

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="lc-btn-ghost !px-2"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <div
              className="hidden md:flex items-center justify-center w-7 h-7 rounded-full text-sm shrink-0 ml-0.5"
              style={{ background: "var(--surface-2)" }}
              title={user.name}
            >
              {user.avatar}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
