import { useState, useEffect } from 'react'
import { BREAKING_NEWS } from '../../utils/absurdContent'

export default function NewsTicker() {
  const [headline, setHeadline] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setHeadline(h => (h + 1) % BREAKING_NEWS.length)
    }, 35000)
    return () => clearInterval(t)
  }, [])

  const text = BREAKING_NEWS.slice(headline).concat(BREAKING_NEWS.slice(0, headline)).join('   ·   ')

  return (
    <div className="bg-hot text-dark text-xs font-bold py-1 overflow-hidden whitespace-nowrap flex items-center">
      <span className="shrink-0 bg-dark text-hot px-2 py-0.5 mr-2 font-glitch text-sm tracking-wider">
        BREAKING
      </span>
      <div className="animate-marquee inline-block">
        {text}
      </div>
    </div>
  )
}
