import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useSocket } from '../../hooks/useSocket'
import { useScoreFloat } from '../../hooks/useScoreFloat'
import NewsTicker from './NewsTicker'
import GlobalVibe from './GlobalVibe'
import Countdown from './Countdown'
import ScoreFloater from '../Score/ScoreFloater'
import ScoreDisplay from '../Score/ScoreDisplay'

export default function AppShell({ children }) {
  const { user, logout } = useAuth()
  const socket = useSocket()
  const { floaters, addFloater } = useScoreFloat()
  const [score, setScore] = useState(user?.score ?? 0)
  const location = useLocation()

  useEffect(() => {
    if (!socket) return
    socket.on('score_update', ({ userId, newScore, delta, reason }) => {
      if (userId === user?.id) {
        setScore(newScore)
        addFloater({ delta, reason })
      }
    })
    socket.on('mass_score_shuffle', ({ updates }) => {
      const me = updates.find(u => u.userId === user?.id)
      if (me) {
        addFloater({ delta: me.newScore - score, reason: 'someone pressed the button' })
        setScore(me.newScore)
      }
    })
    return () => { socket.off('score_update'); socket.off('mass_score_shuffle') }
  }, [socket, user, score])

  async function handleChaos() {
    await fetch('/api/posts/chaos', { method: 'POST', credentials: 'include' })
  }

  const nav = (to, label) => {
    const active = location.pathname === to
    return (
      <Link to={to} className={`text-sm transition-colors ${active ? 'font-semibold' : 'text-gray-400 hover:text-black'}`}>
        {label}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NewsTicker />

        {/* Main header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto px-6 h-12 flex items-center gap-6">
            <Link to="/" className="font-mono text-2xl tracking-widest">BLORP</Link>

            <nav className="flex items-center gap-5">
              {nav('/', 'feed')}
              {nav('/leaderboard', 'leaderboard')}
            </nav>

            <div className="ml-auto flex items-center gap-5">
              <GlobalVibe />
              <Countdown />
              <ScoreDisplay score={score} />
              <button
                onClick={handleChaos}
                className="text-xs border border-gray-300 px-2.5 py-1 text-gray-400 hover:border-black hover:text-black transition-colors"
              >
                do not press
              </button>
              <button onClick={logout} className="text-xs text-gray-400 hover:text-black transition-colors">
                logout
              </button>
            </div>
          </div>
        </header>
      </div>

      <main className="pt-20 pb-16 px-6 max-w-3xl mx-auto">
        {children}
      </main>

      <ScoreFloater floaters={floaters} />
    </div>
  )
}
