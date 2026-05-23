import { BREAKING_NEWS } from '../../utils/absurdContent'

const text = BREAKING_NEWS.join('   ·   ')

export default function NewsTicker() {
  return (
    <div className="border-b border-gray-200 bg-white overflow-hidden whitespace-nowrap flex items-center h-7">
      <span className="shrink-0 text-xs font-bold uppercase tracking-widest px-3 border-r border-gray-200 h-full flex items-center">
        Breaking
      </span>
      <div className="animate-marquee inline-block text-xs text-gray-500 pl-6">
        {text}
      </div>
    </div>
  )
}
