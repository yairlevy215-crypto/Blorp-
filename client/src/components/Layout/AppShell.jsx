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
  const [scoreFlash, setScoreFlash] = useState(false)
  const [chaosShake, setChaosShake] = useState(false)
  const [chaosMsg, setChaosMsg] = useState(null)
  const location = useLocation()

  useEffect(() => {
    if (!socket) return

    socket.on('score_update', ({ userId, newScore, delta, reason }) => {
      if (userId === user?.id) {
        setScore(newScore)
        setScoreFlash(true)
        setTimeout(() => setScoreFlash(false), 400)
        addFloater({ delta, reason })
      }
    })

    socket.on('mass_score_shuffle', ({ updates }) => {
      const me = updates.find(u => u.userId === user?.id)
      if (me) {
        const delta = me.newScore - score
        setScore(me.newScore)
        addFloater({ delta, reason: 'someone pressed the button' })
      }
      setChaosShake(true)
      setTimeout(() => setChaosShake(false), 500)
    })

    return () => {
      socket.off('score_update')
      socket.off('mass_score_shuffle')
    }
  }, [socket, user, score])

  async function handleChaos() {
    try {
      const r = await fetch('/api/posts/chaos', { method: 'POST', credentials: 'include' })
      if (r.ok) {
        setChaosMsg('CHAOS UNLEASHED')
        setTimeout(() => setChaosMsg(null), 2000)
      }
    } catch { /* silent */ }
  }

  const navLink = (to, label) => {
    const active = location.pathname === to
    return (
      <Link
        to={to}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          active
            ? 'bg-neon/10 text-neon border border-neon/30'
            : 'text-muted hover:text-white'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <div className={`min-h-screen bg-dark ${chaosShake ? 'animate-shake' : ''}`}>
      {/* Breaking news */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NewsTicker />
      </div>

      {/* Header */}
      <header className="fixed top-6 left-0 right-0 z-40 border-b border-border bg-darker/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="font-glitch text-3xl text-neon animate-glitch-slow shrink-0 select-none">
            BLORP
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1 ml-2">
            {navLink('/', 'feed')}
            {navLink('/leaderboard', 'leaderboard')}
          </nav>

          {/* Vibe + countdown */}
          <div className="hidden sm:flex items-center gap-4 ml-auto">
            <GlobalVibe />
            <Countdown />
          </div>

          {/* Score + avatar */}
          <div className="flex items-center gap-3 ml-auto sm:ml-4 shrink-0">
            <ScoreDisplay score={score} flashing={scoreFlash} />
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-border"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-dim border-2 border-border flex items-center justify-center text-xs font-bold">
                {user?.name?.[0] || '?'}
              </div>
            )}
            <button
              onClick={logout}
              className="text-xs text-muted hover:text-hot transition-colors hidden sm:block"
            >
              logout
            </button>
          </div>
        </div>

        {/* Sub-bar: chaos button */}
        <div className="border-t border-border/50 bg-darker/80">
          <div className="max-w-5xl mx-auto px-4 h-8 flex items-center gap-4">
            <span className="text-xs text-dim">@{user?.username}</span>
            <div className="ml-auto flex items-center gap-3">
              {chaosMsg && (
                <span className="text-xs text-hot animate-pulse font-glitch">{chaosMsg}</span>
              )}
              <button
                onClick={handleChaos}
                className="text-xs border border-hot/40 text-hot px-3 py-0.5 rounded hover:bg-hot hover:text-dark transition-all font-mono animate-pulse hover:animate-none"
              >
                ⚠ DO NOT PRESS
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-28 pb-12 px-4 max-w-5xl mx-auto">
        {children}
      </main>

      {/* Score floaters */}
      <ScoreFloater floaters={floaters} />
    </div>
  )
}
