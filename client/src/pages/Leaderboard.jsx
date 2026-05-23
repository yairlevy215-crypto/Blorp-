import { useState } from 'react'
import GlobalLeaderboard from '../components/Leaderboard/GlobalLeaderboard'
import FriendsLeaderboard from '../components/Leaderboard/FriendsLeaderboard'

export default function LeaderboardPage() {
  const [tab, setTab] = useState('global')

  const tabClass = (t) =>
    `text-sm pb-2 border-b-2 mr-6 transition-colors ${
      tab === t ? 'border-black font-medium' : 'border-transparent text-gray-400 hover:text-black'
    }`

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">leaderboard</h2>
        <p className="text-sm text-gray-400">scores are meaningless. rankings are even more so.</p>
      </div>

      <div className="flex border-b border-gray-100 mb-6">
        <button className={tabClass('global')} onClick={() => setTab('global')}>global</button>
        <button className={tabClass('friends')} onClick={() => setTab('friends')}>friends</button>
      </div>

      {tab === 'global' ? <GlobalLeaderboard /> : <FriendsLeaderboard />}
    </div>
  )
}
