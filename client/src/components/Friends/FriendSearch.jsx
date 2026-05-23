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
      } finally { setLoading(false) }
    }, 350)
  }, [query])

  async function addFriend(userId) {
    const r = await fetch(`/api/friends/${userId}`, { method: 'POST', credentials: 'include' })
    if (r.ok) setAdded(s => new Set([...s, userId]))
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">find people</h3>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="search by username"
        className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black transition-colors placeholder-gray-300"
      />

      {loading && <p className="text-xs text-gray-400 mt-2">searching...</p>}

      {results.length > 0 && (
        <ul className="mt-3 space-y-2">
          {results.map(u => (
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
                <p className="text-xs text-gray-400">@{u.username}</p>
              </div>
              <button
                onClick={() => addFriend(u.id)}
                disabled={added.has(u.id)}
                className="text-xs border border-gray-200 px-2 py-0.5 hover:border-black transition-colors disabled:opacity-40"
              >
                {added.has(u.id) ? 'added' : 'add'}
              </button>
            </li>
          ))}
        </ul>
      )}

      {query.trim().length >= 2 && results.length === 0 && !loading && (
        <p className="text-xs text-gray-400 mt-2">no results</p>
      )}
    </div>
  )
}
