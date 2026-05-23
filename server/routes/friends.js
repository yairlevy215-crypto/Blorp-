const express = require('express')
const { pool } = require('../db/client')
const { isAuthenticated } = require('../middleware/auth')

const router = express.Router()

// GET /api/friends — list current user's friends
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT u.id, u.username, u.name, u.avatar_url, u.score
      FROM users u
      JOIN friendships f ON f.friend_id = u.id
      WHERE f.user_id = $1
      ORDER BY u.username
    `, [req.user.id])
    res.json(rows)
  } catch (err) {
    console.error('[friends] list error:', err.message)
    res.status(500).json({ error: 'Failed to list friends' })
  }
})

// POST /api/friends/:userId — add friend (bidirectional)
router.post('/:userId', isAuthenticated, async (req, res) => {
  const { userId } = req.params
  if (userId === req.user.id) {
    return res.status(400).json({ error: 'Cannot friend yourself' })
  }
  try {
    const { rows: [target] } = await pool.query('SELECT id FROM users WHERE id=$1', [userId])
    if (!target) return res.status(404).json({ error: 'User not found' })

    await pool.query(
      `INSERT INTO friendships (user_id, friend_id) VALUES ($1, $2), ($2, $1)
       ON CONFLICT DO NOTHING`,
      [req.user.id, userId]
    )
    res.json({ ok: true })
  } catch (err) {
    console.error('[friends] add error:', err.message)
    res.status(500).json({ error: 'Failed to add friend' })
  }
})

// DELETE /api/friends/:userId — remove friend
router.delete('/:userId', isAuthenticated, async (req, res) => {
  const { userId } = req.params
  try {
    await pool.query(
      `DELETE FROM friendships
       WHERE (user_id=$1 AND friend_id=$2) OR (user_id=$2 AND friend_id=$1)`,
      [req.user.id, userId]
    )
    res.json({ ok: true })
  } catch (err) {
    console.error('[friends] remove error:', err.message)
    res.status(500).json({ error: 'Failed to remove friend' })
  }
})

module.exports = router
