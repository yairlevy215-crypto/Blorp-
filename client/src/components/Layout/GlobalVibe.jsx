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
    <span className="text-xs text-gray-400">
      vibe: <span className="text-black font-medium">{vibe}</span>
    </span>
  )
}
