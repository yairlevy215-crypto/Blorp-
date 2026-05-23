import { useState, useEffect } from 'react'
import { useSocket } from '../../hooks/useSocket'
import { GLOBAL_VIBES } from '../../utils/absurdContent'

export default function GlobalVibe() {
  const [vibe, setVibe] = useState(() => GLOBAL_VIBES[Math.floor(Math.random() * GLOBAL_VIBES.length)])
  const socket = useSocket()

  useEffect(() => {
    if (!socket) return
    socket.on('vibe_change', ({ vibe: v }) => setVibe(v))
    return () => socket.off('vibe_change')
  }, [socket])

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted">
      <span>global vibe:</span>
      <span className="font-glitch text-base text-neon animate-vibe-pulse uppercase tracking-wider">
        {vibe}
      </span>
    </div>
  )
}
