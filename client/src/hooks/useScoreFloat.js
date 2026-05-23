import { useState, useCallback } from 'react'

export function useScoreFloat() {
  const [floaters, setFloaters] = useState([])

  const addFloater = useCallback(({ delta, reason }) => {
    const id = Date.now() + Math.random()
    const x = 15 + Math.random() * 55
    setFloaters(f => [...f, { id, delta, reason, x }])
    setTimeout(() => {
      setFloaters(f => f.filter(item => item.id !== id))
    }, 2600)
  }, [])

  return { floaters, addFloater }
}
