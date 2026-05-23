export default function ScoreFloater({ floaters }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {floaters.map(({ id, delta, reason, x }) => (
        <div
          key={id}
          className="absolute animate-float-up text-center"
          style={{ left: `${x}%`, top: '100px' }}
        >
          <div className="font-mono text-2xl font-bold">
            {delta >= 0 ? '+' : ''}{delta}
          </div>
          <div className="text-xs text-gray-500 max-w-36 leading-tight mt-0.5 bg-white/90 px-1.5 py-0.5 border border-gray-200">
            {reason}
          </div>
        </div>
      ))}
    </div>
  )
}
