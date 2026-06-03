import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="text-center text-xs text-gray-600 py-6">
        Powered by{' '}
        <a href="https://holodex.net" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400">
          Holodex
        </a>
        . Oshiwatch is not affiliated with Cover Corp.
      </footer>
    </div>
  )
}
