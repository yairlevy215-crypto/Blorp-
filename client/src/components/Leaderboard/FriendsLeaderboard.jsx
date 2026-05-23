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

  if (loading) return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-gray-50 rounded" />)}
    </div>
  )

  if (entries.length <= 1) return (
    <p className="text-sm text-gray-400 py-8">add friends to compare scores</p>
  )

  return (
    <div>
      {entries.map((entry, idx) => (
        <div
          key={entry.id}
          className={`flex items-center gap-3 py-3 border-b border-gray-100 ${entry.id === user?.id ? 'font-medium' : ''}`}
        >
          <span className="text-xs text-gray-400 w-6 text-right shrink-0">{idx + 1}</span>
          {entry.avatar_url ? (
            <img src={entry.avatar_url} alt="" className="w-7 h-7 rounded-full shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded-full border border-gray-200 shrink-0 flex items-center justify-center text-xs text-gray-400">
              {entry.name?.[0] || '?'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="text-sm">
              {entry.name}
              {entry.id === user?.id && <span className="text-gray-400 font-normal ml-1">(you)</span>}
            </span>
          </div>
          <span className="font-mono text-sm shrink-0">{entry.score.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}
