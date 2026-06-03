import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="font-bold text-lg tracking-tight">
        Oshiwatch
      </Link>
      <div className="flex gap-6 text-sm text-gray-400">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'text-white' : 'hover:text-white transition-colors'}>
          Live
        </NavLink>
        <NavLink to="/talents" className={({ isActive }) => isActive ? 'text-white' : 'hover:text-white transition-colors'}>
          Talents
        </NavLink>
      </div>
    </nav>
  )
}
