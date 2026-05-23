const express = require('express')
const { pool } = require('../db/client')
const { isAuthenticated } = require('../middleware/auth')

const router = express.Router()

// GET /api/leaderboard/global — top 50 users by score
router.get('/global', isAuthenticated, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, username, avatar_url, score
       FROM users
       ORDER BY score DESC
       LIMIT 50`
    )
    res.json(rows)
  } catch (err) {
    console.error('[leaderboard] global error:', err.message)
    res.status(500).json({ error: 'Failed to fetch leaderboard' })
  }
})

// GET /api/leaderboard/friends — current user + friends ranked by score
router.get('/friends', isAuthenticated, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, username, avatar_url, score
       FROM users
       WHERE id = $1
          OR id IN (SELECT friend_id FROM friendships WHERE user_id = $1)
       ORDER BY score DESC`,
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    console.error('[leaderboard] friends error:', err.message)
    res.status(500).json({ error: 'Failed to fetch leaderboard' })
  }
})

module.exports = router
