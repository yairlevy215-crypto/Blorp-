import { useState } from 'react'

export default function PostComposer({ onPost }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [placeholder] = useState(() => {
    const options = [
      'say something. anything. go.',
      'keyboard smash here →',
      'what noise does your brain make right now',
      'type into the void',
      'communicate using words or not',
      'write something that doesn\'t matter (everything matters)',
    ]
    return options[Math.floor(Math.random() * options.length)]
  })

  async function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim() || loading) return
    setLoading(true)
    try {
      const r = await fetch('/api/posts', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (r.ok) {
        setContent('')
        onPost?.()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-4 mb-6">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        maxLength={500}
        className="w-full bg-transparent text-white placeholder-muted resize-none outline-none text-sm leading-relaxed"
        onKeyDown={e => {
          if (e.key === 'Enter' && e.ctrlKey) handleSubmit(e)
        }}
      />
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <div className="text-xs text-dim">
          {content.length > 0 && (
            <span>your post will be described in a way you cannot predict</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">{content.length}/500</span>
          <button
            type="submit"
            disabled={!content.trim() || loading}
            className="bg-neon text-dark text-sm font-bold px-4 py-1.5 rounded hover:bg-neon/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'processing...' : 'blorp it'}
          </button>
        </div>
      </div>
    </form>
  )
}
