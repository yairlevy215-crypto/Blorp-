const express = require('express')
const passport = require('passport')
const { Strategy: GoogleStrategy } = require('passport-google-oauth20')
const { pool } = require('../db/client')
const { isAuthenticated } = require('../middleware/auth')

const router = express.Router()

async function upsertUser(profile) {
  const googleId = profile.id
  const name = profile.displayName || 'Mystery Person'
  const avatarUrl = profile.photos?.[0]?.value || null

  // Try to find existing user
  const { rows: existing } = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [googleId]
  )
  if (existing[0]) {
    // Update name/avatar in case they changed
    const { rows } = await pool.query(
      'UPDATE users SET name=$1, avatar_url=$2 WHERE id=$3 RETURNING *',
      [name, avatarUrl, googleId]
    )
    return rows[0]
  }

  // Generate unique username
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').slice(0, 15).replace(/^_|_$/g, '') || 'user'
  let username
  for (let i = 0; i < 10; i++) {
    const candidate = `${base}_${Math.floor(1000 + Math.random() * 9000)}`
    const { rows } = await pool.query('SELECT id FROM users WHERE username=$1', [candidate])
    if (rows.length === 0) { username = candidate; break }
  }
  if (!username) username = `${base}_${Date.now()}`

  const { rows } = await pool.query(
    'INSERT INTO users (id, name, avatar_url, username, score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [googleId, name, avatarUrl, username, Math.floor(Math.random() * 500)]
  )
  return rows[0]
}

// Configure passport strategies
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await upsertUser(profile)
    done(null, user)
  } catch (err) {
    done(err)
  }
}))

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [id])
    done(null, rows[0] || false)
  } catch (err) {
    done(err)
  }
})

// Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173')
  }
)

router.post('/logout', isAuthenticated, (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err)
    res.json({ ok: true })
  })
})

module.exports = router
