import { useState, useEffect } from 'react'

export default function ScoreDisplay({ score, flashing }) {
  return (
    <div className={`flex flex-col items-end ${flashing ? 'animate-score-pop' : ''}`}>
      <span className="text-xs text-muted uppercase tracking-widest">score</span>
      <span className="font-glitch text-2xl text-neon leading-none text-glow-neon">
        {score.toLocaleString()}
      </span>
    </div>
  )
}
