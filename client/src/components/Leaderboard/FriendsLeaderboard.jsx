import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function FriendsLeaderboard() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard/friends', { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setEntries(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="animate-pulse space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-card rounded" />)}</div>

  if (entries.length <= 1) {
    return (
      <div className="text-center py-8 text-muted">
        <p className="font-glitch text-2xl mb-2">just you</p>
        <p className="text-sm">add friends to see who is winning meaninglessly</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {entries.map((entry, idx) => (
        <div
          key={entry.id}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
            entry.id === user?.id ? 'bg-neon/5 border border-neon/20' : 'hover:bg-card'
          }`}
        >
          <span className={`font-glitch text-lg w-8 text-center shrink-0 ${
            idx === 0 ? 'text-yellow-400' : 'text-muted'
          }`}>{idx + 1}</span>
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
          </div>
          <span className="font-glitch text-xl text-neon shrink-0">{entry.score.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}
