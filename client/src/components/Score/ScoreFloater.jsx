export default function ScoreFloater({ floaters }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {floaters.map(({ id, delta, reason, x }) => (
        <div
          key={id}
          className="absolute animate-float-up text-center"
          style={{ left: `${x}%`, top: '120px' }}
        >
          <div className={`font-glitch text-3xl font-bold ${delta >= 0 ? 'text-neon text-glow-neon' : 'text-hot text-glow-hot'}`}>
            {delta >= 0 ? '+' : ''}{delta}
          </div>
          <div className="text-xs text-muted max-w-40 leading-tight mt-0.5 bg-darker/80 px-1.5 py-0.5 rounded">
            {reason}
          </div>
        </div>
      ))}
    </div>
  )
}
