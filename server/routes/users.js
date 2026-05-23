const express = require('express')
const { pool } = require('../db/client')
const { isAuthenticated } = require('../middleware/auth')

const router = express.Router()

// GET /api/users/search?q= — search by username
router.get('/search', isAuthenticated, async (req, res) => {
  const { q } = req.query
  if (!q || q.trim().length < 2) {
    return res.json([])
  }
  try {
    const { rows } = await pool.query(
      `SELECT id, username, name, avatar_url, score
       FROM users
       WHERE username ILIKE $1 AND id != $2
       LIMIT 10`,
      [`%${q.trim()}%`, req.user.id]
    )
    res.json(rows)
  } catch (err) {
    console.error('[users] search error:', err.message)
    res.status(500).json({ error: 'Search failed' })
  }
})

module.exports = router
