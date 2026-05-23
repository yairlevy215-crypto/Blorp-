import { useState } from 'react'

export default function PostComposer({ onPost }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

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
      if (r.ok) { setContent(''); onPost?.() }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 mb-8">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="say something"
        rows={3}
        maxLength={500}
        className="w-full px-4 pt-4 pb-2 text-sm resize-none outline-none placeholder-gray-300"
        onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleSubmit(e) }}
      />
      <div className="flex items-center justify-between px-4 pb-3">
        <span className="text-xs text-gray-300">{content.length}/500</span>
        <button
          type="submit"
          disabled={!content.trim() || loading}
          className="text-xs bg-black text-white px-4 py-1.5 disabled:opacity-30 hover:bg-gray-800 transition-colors"
        >
          {loading ? '...' : 'post'}
        </button>
      </div>
    </form>
  )
}
