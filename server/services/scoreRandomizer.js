const SCORE_REASONS = [
  'mercury is in retrograde',
  'a cat somewhere sneezed',
  'the algorithm felt like it',
  'you breathed',
  'the void giggled',
  'someone ate cereal for dinner',
  'a pigeon looked at a building',
  'Tuesday happened again',
  'the server hiccuped',
  'a dog barked at nothing',
  'the moon shrugged',
  'quantum uncertainty increased briefly',
  'a butterfly flapped in Ohio',
  'someone used Comic Sans unironically',
  'the sun was a bit round today',
  'gravity persisted as usual',
  'a sock was lost in a dryer',
  'someone thought about sandwiches',
  'the universe blinked',
  'a cloud changed shape for no reason',
  'mercury is still in retrograde (it doesn\'t leave)',
  'someone said "per my last email"',
  'a star somewhere is confused',
  'the grid fluctuated imperceptibly',
  'someone left a cupboard open',
  'an algorithm had feelings',
  'a number wanted to change',
  'existing is expensive',
  'the vibes shifted at 3:47am',
  'a tree made a sound and nobody heard it',
  'your aura was recalibrated automatically',
  'someone nearby thought very loudly',
  'the internet gods are bored',
  'cosmic background radiation spiked',
  'you were in the wrong timezone mentally',
  'a spreadsheet somewhere has your fate in it',
  'the algorithm sneezed',
  'entropy increased, as always',
]

function startScoreRandomizer(io, pool) {
  const INTERVAL = 4000

  setInterval(async () => {
    try {
      const { rows: users } = await pool.query(
        'SELECT id FROM users ORDER BY RANDOM() LIMIT 3'
      )
      if (users.length === 0) return

      for (const user of users) {
        const delta = Math.floor(Math.random() * 60) - 30
        const reason = SCORE_REASONS[Math.floor(Math.random() * SCORE_REASONS.length)]

        const { rows } = await pool.query(
          'UPDATE users SET score = GREATEST(0, score + $1) WHERE id = $2 RETURNING score',
          [delta, user.id]
        )
        if (!rows[0]) continue

        io.emit('score_update', {
          userId: user.id,
          newScore: rows[0].score,
          delta,
          reason,
        })
      }

      const { rows: top } = await pool.query(
        'SELECT id, name, username, avatar_url, score FROM users ORDER BY score DESC LIMIT 50'
      )
      io.emit('leaderboard_update', { entries: top })
    } catch (err) {
      console.error('[scoreRandomizer] error:', err.message)
    }
  }, INTERVAL)
}

module.exports = { startScoreRandomizer, SCORE_REASONS }
