import { useState, useEffect, useRef } from 'react'

function randomFutureMs() {
  return Date.now() + (30 + Math.random() * 570) * 1000
}

export default function Countdown() {
  const targetRef = useRef(randomFutureMs())
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const tick = () => {
      const diff = targetRef.current - Date.now()
      if (diff <= 0) { targetRef.current = randomFutureMs(); return }
      const s = Math.floor(diff / 1000)
      const m = Math.floor(s / 60)
      const h = Math.floor(m / 60)
      setTimeLeft(`${String(h % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="text-xs text-gray-400 font-mono">
      until ???: <span className="text-black">{timeLeft}</span>
    </span>
  )
}
