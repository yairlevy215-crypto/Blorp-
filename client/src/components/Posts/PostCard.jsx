import { useState } from 'react'
import { playRandomSound } from '../../utils/sounds'
import { REACTION_LABELS } from '../../utils/absurdContent'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function PostCard({ post }) {
  const [reacted, setReacted] = useState(false)
  const [label] = useState(() => REACTION_LABELS[Math.floor(Math.random() * REACTION_LABELS.length)])

  function handleReact() {
    playRandomSound()
    setReacted(r => !r)
  }

  return (
    <article className="bg-card border border-border rounded-lg p-4 space-y-3 hover:border-border/80 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-2">
        {post.avatar_url ? (
          <img src={post.avatar_url} alt={post.name} className="w-8 h-8 rounded-full shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-dim shrink-0 flex items-center justify-center text-xs font-bold text-muted">
            {post.name?.[0] || '?'}
          </div>
        )}
        <div className="min-w-0">
          <span className="text-sm font-semibold text-white truncate block">{post.name}</span>
          <span className="text-xs text-muted">@{post.username}</span>
        </div>
        <span className="ml-auto text-xs text-dim shrink-0">{timeAgo(post.created_at)}</span>
      </div>

      {/* Content */}
      <p className="text-white/90 text-sm leading-relaxed break-words">{post.content}</p>

      {/* Absurd description */}
      <div className="inline-flex items-center gap-1.5 bg-neon/5 border border-neon/20 rounded px-2.5 py-1">
        <span className="text-neon text-xs">✦</span>
        <span className="text-neon/80 text-xs italic">{post.description}</span>
      </div>

      {/* Reaction */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handleReact}
          className={`text-xs px-3 py-1 rounded border transition-all ${
            reacted
              ? 'border-hot/50 text-hot bg-hot/10'
              : 'border-border text-muted hover:border-muted/50 hover:text-white'
          }`}
        >
          {reacted ? '✓ ' : ''}{label}
        </button>
      </div>
    </article>
  )
}
