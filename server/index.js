require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const pgSession = require('connect-pg-simple')(session)
const { Server } = require('socket.io')
const { pool } = require('./db/client')
const { isAuthenticated } = require('./middleware/auth')
const { startScoreRandomizer } = require('./services/scoreRandomizer')

const app = express()
const server = http.createServer(app)

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

const io = new Server(server, {
  cors: { origin: CLIENT_URL, credentials: true },
})
app.set('io', io)

// Middleware
app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(express.json())

const sessionMiddleware = session({
  store: new pgSession({ pool, createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET || 'blorp-dev-secret-change-in-prod',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
})

app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())

// Auth routes (also configures passport strategies as a side effect)
const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

// /api/me
app.get('/api/me', isAuthenticated, (req, res) => res.json(req.user))

// API routes
app.use('/api/posts', require('./routes/posts'))
app.use('/api/friends', require('./routes/friends'))
app.use('/api/users', require('./routes/users'))
app.use('/api/leaderboard', require('./routes/leaderboard'))

// Socket.io handlers
require('./socket/handlers')(io)

// Start score chaos engine
startScoreRandomizer(io, pool)

// Vibe broadcaster
const VIBES = ['chaotic', 'moist', 'beige', 'uncertain', 'crispy', 'clammy', 'oblique', 'pending', 'damp', 'fluorescent']
setInterval(() => {
  io.emit('vibe_change', { vibe: VIBES[Math.floor(Math.random() * VIBES.length)] })
}, 8000 + Math.random() * 7000)

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`🌀 BLORP server running on :${PORT}`)
})
