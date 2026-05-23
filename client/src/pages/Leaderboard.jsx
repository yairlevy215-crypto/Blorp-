import { useState } from 'react'
import GlobalLeaderboard from '../components/Leaderboard/GlobalLeaderboard'
import FriendsLeaderboard from '../components/Leaderboard/FriendsLeaderboard'

export default function LeaderboardPage() {
  const [tab, setTab] = useState('global')

  const tabClass = (t) =>
    `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      tab === t ? 'border-neon text-neon' : 'border-transparent text-muted hover:text-white'
    }`

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-glitch text-3xl text-white mb-1">leaderboard</h2>
        <p className="text-muted text-sm">scores are meaningless. rankings are even more so.</p>
      </div>

      <div className="flex border-b border-border mb-6">
        <button className={tabClass('global')} onClick={() => setTab('global')}>global</button>
        <button className={tabClass('friends')} onClick={() => setTab('friends')}>friends</button>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        {tab === 'global' ? <GlobalLeaderboard /> : <FriendsLeaderboard />}
      </div>
    </div>
  )
}
