import { useState, useEffect, useCallback } from 'react'
import { useSocket } from '../../hooks/useSocket'
import PostCard from './PostCard'
import FriendSearch from '../Friends/FriendSearch'
import FriendsList from '../Friends/FriendsList'

const TABS = ['global', 'friends', 'social']

export default function Feed() {
  const socket = useSocket()
  const [tab, setTab] = useState('global')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = useCallback(async (reset = false) => {
    if (tab === 'social') return
    setLoading(true)
    const base = tab === 'global' ? '/api/posts/global' : '/api/posts/friends'
    const url = !reset && cursor ? `${base}?cursor=${cursor}` : base
    try {
      const r = await fetch(url, { credentials: 'include' })
      const data = await r.json()
      reset ? setPosts(data) : setPosts(p => [...p, ...data])
      setHasMore(data.length === 20)
      if (data.length > 0) setCursor(data[data.length - 1].created_at)
    } finally {
      setLoading(false)
    }
  }, [tab, cursor])

  useEffect(() => {
    setCursor(null); setHasMore(true); setPosts([])
    if (tab !== 'social') fetchPosts(true)
    else setLoading(false)
  }, [tab])

  useEffect(() => {
    if (!socket || tab !== 'global') return
    const handler = (post) => setPosts(p => [post, ...p])
    socket.on('new_post', handler)
    return () => socket.off('new_post', handler)
  }, [socket, tab])

  const tabClass = (t) =>
    `text-sm pb-2 border-b-2 mr-6 transition-colors ${
      tab === t ? 'border-black font-medium' : 'border-transparent text-gray-400 hover:text-black'
    }`

  return (
    <div>
      <div className="flex border-b border-gray-100 mb-6">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={tabClass(t)}>{t}</button>
        ))}
      </div>

      {tab === 'social' ? (
        <div className="grid gap-6 md:grid-cols-2">
          <FriendSearch />
          <FriendsList />
        </div>
      ) : (
        <>
          {loading && posts.length === 0 ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b border-gray-100 py-5">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-sm text-gray-400 py-8">
              {tab === 'friends' ? 'add friends or wait for them to post' : 'nothing here yet'}
            </p>
          ) : (
            posts.map(post => <PostCard key={post.id} post={post} />)
          )}

          {hasMore && !loading && posts.length > 0 && (
            <button
              onClick={() => fetchPosts(false)}
              className="mt-6 text-xs text-gray-400 hover:text-black transition-colors"
            >
              load more
            </button>
          )}
        </>
      )}
    </div>
  )
}
