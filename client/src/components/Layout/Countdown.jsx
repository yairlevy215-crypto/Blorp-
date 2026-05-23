import { useState, useEffect, useRef } from 'react'

function randomFutureMs() {
  return Date.now() + (30 + Math.random() * 570) * 1000
}

export default function Countdown() {
  const targetRef = useRef(randomFutureMs())
  const [timeLeft, setTimeLeft] = useState(null)
  const [label] = useState(() => {
    const labels = ['until nothing', 'until it happens', 'until ???', 'until the thing', 'until end of beige']
    return labels[Math.floor(Math.random() * labels.length)]
  })

  useEffect(() => {
    const tick = () => {
      const diff = targetRef.current - Date.now()
      if (diff <= 0) {
        targetRef.current = randomFutureMs()
        return
      }
      const s = Math.floor(diff / 1000)
      const m = Math.floor(s / 60)
      const h = Math.floor(m / 60)
      setTimeLeft(`${String(h % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (!timeLeft) return null

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted">
      <span>{label}:</span>
      <span className="font-glitch text-base text-hot">{timeLeft}</span>
    </div>
  )
}
