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
    const r = await fetch(`/api/friends/${userId}`, { method: 'DELETE', credentials: 'include' })
    if (r.ok) setFriends(f => f.filter(u => u.id !== userId))
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">friends ({friends.length})</h3>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded" />)}
        </div>
      ) : friends.length === 0 ? (
        <p className="text-sm text-gray-400">no friends yet</p>
      ) : (
        <ul className="space-y-2">
          {friends.map(u => (
            <li key={u.id} className="flex items-center gap-2">
              {u.avatar_url ? (
                <img src={u.avatar_url} alt="" className="w-7 h-7 rounded-full" />
              ) : (
                <div className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                  {u.name?.[0] || '?'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{u.name}</p>
                <p className="text-xs text-gray-400">{u.score}</p>
              </div>
              <button
                onClick={() => removeFriend(u.id)}
                className="text-xs text-gray-300 hover:text-black transition-colors"
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
