import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-bold text-base tracking-tight text-white hover:opacity-80 transition-opacity"
        >
          Oshiwatch
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "text-white bg-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            Live
          </NavLink>
          <NavLink
            to="/talents"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "text-white bg-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            Talents
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
