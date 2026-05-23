const express = require('express')
const { pool } = require('../db/client')
const { isAuthenticated } = require('../middleware/auth')
const { getDescription } = require('../services/descriptions')
const { SCORE_REASONS } = require('../services/scoreRandomizer')

const router = express.Router()

// POST /api/posts — create a post
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { content } = req.body
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' })
    }
    const trimmed = content.trim().slice(0, 500)
    const description = await getDescription(trimmed)

    const { rows: [post] } = await pool.query(
      `INSERT INTO posts (user_id, content, description) VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, trimmed, description]
    )

    const result = {
      ...post,
      username: req.user.username,
      avatar_url: req.user.avatar_url,
      name: req.user.name,
    }

    req.app.get('io').emit('new_post', result)
    res.json(result)
  } catch (err) {
    console.error('[posts] create error:', err.message)
    res.status(500).json({ error: 'Failed to create post' })
  }
})

// GET /api/posts/global — global feed with cursor pagination
router.get('/global', isAuthenticated, async (req, res) => {
  try {
    const { cursor } = req.query
    const params = []
    let where = ''
    if (cursor) {
      params.push(cursor)
      where = 'WHERE p.created_at < $1'
    }

    const { rows } = await pool.query(`
      SELECT p.*, u.username, u.avatar_url, u.name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ${where}
      ORDER BY p.created_at DESC
      LIMIT 20
    `, params)

    res.json(rows)
  } catch (err) {
    console.error('[posts] global feed error:', err.message)
    res.status(500).json({ error: 'Failed to fetch feed' })
  }
})

// GET /api/posts/friends — friends-only feed
router.get('/friends', isAuthenticated, async (req, res) => {
  try {
    const { cursor } = req.query
    const params = [req.user.id]
    let cursorClause = ''
    if (cursor) {
      params.push(cursor)
      cursorClause = `AND p.created_at < $${params.length}`
    }

    const { rows } = await pool.query(`
      SELECT p.*, u.username, u.avatar_url, u.name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE (
        p.user_id = $1
        OR p.user_id IN (SELECT friend_id FROM friendships WHERE user_id = $1)
      )
      ${cursorClause}
      ORDER BY p.created_at DESC
      LIMIT 20
    `, params)

    res.json(rows)
  } catch (err) {
    console.error('[posts] friends feed error:', err.message)
    res.status(500).json({ error: 'Failed to fetch feed' })
  }
})

// POST /api/chaos/press — DO NOT PRESS: reshuffle all scores
router.post('/chaos', isAuthenticated, async (req, res) => {
  try {
    const { rows: users } = await pool.query('SELECT id FROM users')
    const updates = users.map(u => ({
      userId: u.id,
      newScore: Math.floor(Math.random() * 9999),
    }))

    for (const u of updates) {
      await pool.query('UPDATE users SET score=$1 WHERE id=$2', [u.newScore, u.userId])
    }

    const io = req.app.get('io')
    io.emit('mass_score_shuffle', { updates })

    const { rows: top } = await pool.query(
      'SELECT id, name, username, avatar_url, score FROM users ORDER BY score DESC LIMIT 50'
    )
    io.emit('leaderboard_update', { entries: top })

    res.json({ ok: true })
  } catch (err) {
    console.error('[posts] chaos error:', err.message)
    res.status(500).json({ error: 'Chaos failed (ironic)' })
  }
})

module.exports = router
