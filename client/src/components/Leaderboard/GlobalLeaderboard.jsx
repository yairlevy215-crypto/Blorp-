import { useState, useEffect } from 'react'
import { useSocket } from '../../hooks/useSocket'
import { useAuth } from '../../hooks/useAuth'

export default function GlobalLeaderboard() {
  const { user } = useAuth()
  const socket = useSocket()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard/global', { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setEntries(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.on('leaderboard_update', ({ entries: updated }) => {
      setEntries(updated)
    })
    return () => socket.off('leaderboard_update')
  }, [socket])

  if (loading) return <div className="animate-pulse space-y-2">{[...Array(10)].map((_, i) => <div key={i} className="h-10 bg-card rounded" />)}</div>

  return (
    <div className="space-y-1">
      {entries.map((entry, idx) => (
        <div
          key={entry.id}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            entry.id === user?.id
              ? 'bg-neon/5 border border-neon/20'
              : 'hover:bg-card'
          }`}
        >
          <span className={`font-glitch text-lg w-8 shrink-0 text-center ${
            idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-600' : 'text-muted'
          }`}>
            {idx + 1}
          </span>
          {entry.avatar_url ? (
            <img src={entry.avatar_url} alt="" className="w-7 h-7 rounded-full shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-dim shrink-0 flex items-center justify-center text-xs">
              {entry.name?.[0] || '?'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white truncate">
              {entry.name}
              {entry.id === user?.id && <span className="ml-1.5 text-xs text-neon">(you)</span>}
            </p>
            <p className="text-xs text-muted">@{entry.username}</p>
          </div>
          <span className="font-glitch text-xl text-neon shrink-0">{entry.score.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}
