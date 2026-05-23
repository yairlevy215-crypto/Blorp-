import { useState, useEffect } from 'react'

export default function FriendsList() {
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/friends', { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setFriends(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function removeFriend(userId) {
    const r = await fetch(`/api/friends/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (r.ok) setFriends(f => f.filter(u => u.id !== userId))
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="font-glitch text-xl text-white mb-3">
        your beings ({friends.length})
      </h3>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-9 bg-dim rounded animate-pulse" />
          ))}
        </div>
      ) : friends.length === 0 ? (
        <p className="text-sm text-muted">no friends yet. the void is yours alone.</p>
      ) : (
        <ul className="space-y-2">
          {friends.map(u => (
            <li key={u.id} className="flex items-center gap-2">
              {u.avatar_url ? (
                <img src={u.avatar_url} alt="" className="w-7 h-7 rounded-full shrink-0" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-dim shrink-0 flex items-center justify-center text-xs">
                  {u.name?.[0] || '?'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white truncate">{u.name}</p>
                <p className="text-xs text-muted">score: {u.score}</p>
              </div>
              <button
                onClick={() => removeFriend(u.id)}
                className="text-xs text-dim hover:text-hot transition-colors shrink-0"
              >
                remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
