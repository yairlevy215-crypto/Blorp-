import { useState, useEffect, useCallback } from 'react'
import { useSocket } from '../../hooks/useSocket'
import { useAuth } from '../../hooks/useAuth'
import PostCard from './PostCard'
import FriendSearch from '../Friends/FriendSearch'
import FriendsList from '../Friends/FriendsList'

const TABS = ['global', 'friends', 'social']

export default function Feed() {
  const { user } = useAuth()
  const socket = useSocket()
  const [tab, setTab] = useState('global')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = useCallback(async (reset = false) => {
    setLoading(true)
    const url = tab === 'global'
      ? `/api/posts/global${reset || !cursor ? '' : `?cursor=${cursor}`}`
      : `/api/posts/friends${reset || !cursor ? '' : `?cursor=${cursor}`}`

    if (tab === 'social') { setLoading(false); return }

    try {
      const r = await fetch(url, { credentials: 'include' })
      const data = await r.json()
      if (reset) {
        setPosts(data)
      } else {
        setPosts(p => [...p, ...data])
      }
      setHasMore(data.length === 20)
      if (data.length > 0) setCursor(data[data.length - 1].created_at)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [tab, cursor])

  useEffect(() => {
    setCursor(null)
    setHasMore(true)
    setPosts([])
    if (tab !== 'social') fetchPosts(true)
    else setLoading(false)
  }, [tab])

  useEffect(() => {
    if (!socket || tab !== 'global') return
    const handler = (post) => {
      setPosts(p => [post, ...p])
    }
    socket.on('new_post', handler)
    return () => socket.off('new_post', handler)
  }, [socket, tab])

  function loadMore() {
    fetchPosts(false)
  }

  const tabClass = (t) =>
    `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      tab === t
        ? 'border-neon text-neon'
        : 'border-transparent text-muted hover:text-white'
    }`

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={tabClass(t)}>
            {t}
          </button>
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
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-4 h-28 animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-muted">
              <p className="font-glitch text-2xl mb-2">nothing here</p>
              <p className="text-sm">
                {tab === 'friends' ? 'add friends or wait for them to post something' : 'be the first to blorp'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => <PostCard key={post.id} post={post} />)}
            </div>
          )}

          {hasMore && !loading && posts.length > 0 && (
            <button
              onClick={loadMore}
              className="w-full mt-6 py-2 text-sm text-muted border border-border rounded-lg hover:border-muted/50 hover:text-white transition-colors"
            >
              load more
            </button>
          )}

          {loading && posts.length > 0 && (
            <div className="text-center py-4 text-muted text-sm animate-pulse">loading...</div>
          )}
        </>
      )}
    </div>
  )
}
