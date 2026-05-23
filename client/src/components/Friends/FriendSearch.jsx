import { useState, useEffect, useRef } from 'react'

export default function FriendSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(new Set())
  const timerRef = useRef(null)

  useEffect(() => {
    clearTimeout(timerRef.current)
    if (query.trim().length < 2) { setResults([]); return }
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const r = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, { credentials: 'include' })
        setResults(await r.json())
      } finally {
        setLoading(false)
      }
    }, 350)
  }, [query])

  async function addFriend(userId) {
    const r = await fetch(`/api/friends/${userId}`, {
      method: 'POST',
      credentials: 'include',
    })
    if (r.ok) setAdded(s => new Set([...s, userId]))
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="font-glitch text-xl text-white mb-3">find beings</h3>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="search by username..."
        className="w-full bg-darker border border-border rounded px-3 py-2 text-sm text-white placeholder-muted outline-none focus:border-neon/50 transition-colors"
      />

      {loading && (
        <p className="text-xs text-muted mt-2 animate-pulse">searching the void...</p>
      )}

      {results.length > 0 && (
        <ul className="mt-3 space-y-2">
          {results.map(u => (
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
                <p className="text-xs text-muted">@{u.username}</p>
              </div>
              <button
                onClick={() => addFriend(u.id)}
                disabled={added.has(u.id)}
                className={`text-xs px-2.5 py-1 rounded border transition-all shrink-0 ${
                  added.has(u.id)
                    ? 'border-neon/30 text-neon/60 cursor-default'
                    : 'border-border text-muted hover:border-neon hover:text-neon'
                }`}
              >
                {added.has(u.id) ? 'added' : 'add'}
              </button>
            </li>
          ))}
        </ul>
      )}

      {query.trim().length >= 2 && results.length === 0 && !loading && (
        <p className="text-xs text-muted mt-3">no beings found by that name</p>
      )}
    </div>
  )
}
