export default function ScoreDisplay({ score }) {
  return (
    <div className="flex flex-col items-end leading-none">
      <span className="text-xs text-gray-400 uppercase tracking-widest">score</span>
      <span className="font-mono text-xl">{score.toLocaleString()}</span>
    </div>
  )
}
