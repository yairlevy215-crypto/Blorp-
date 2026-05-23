import { useState } from 'react'
import { playRandomSound } from '../../utils/sounds'
import { REACTION_LABELS } from '../../utils/absurdContent'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

export default function PostCard({ post }) {
  const [reacted, setReacted] = useState(false)
  const [label] = useState(() => REACTION_LABELS[Math.floor(Math.random() * REACTION_LABELS.length)])

  function handleReact() {
    playRandomSound()
    setReacted(r => !r)
  }

  return (
    <article className="border-b border-gray-100 py-5">
      <div className="flex items-start gap-3">
        {post.avatar_url ? (
          <img src={post.avatar_url} alt="" className="w-8 h-8 rounded-full shrink-0 mt-0.5" />
        ) : (
          <div className="w-8 h-8 rounded-full border border-gray-200 shrink-0 mt-0.5 flex items-center justify-center text-xs text-gray-400">
            {post.name?.[0] || '?'}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm font-medium">{post.name}</span>
            <span className="text-xs text-gray-400">@{post.username}</span>
            <span className="text-xs text-gray-300 ml-auto">{timeAgo(post.created_at)}</span>
          </div>

          <p className="text-sm leading-relaxed mb-2">{post.content}</p>

          <p className="text-xs text-gray-400 italic mb-3">{post.description}</p>

          <button
            onClick={handleReact}
            className={`text-xs px-2.5 py-1 border transition-colors ${
              reacted ? 'border-black text-black' : 'border-gray-200 text-gray-400 hover:border-gray-400'
            }`}
          >
            {label}
          </button>
        </div>
      </div>
    </article>
  )
}
