// Minimal mock server for UI preview — no Supabase or OAuth needed
require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', credentials: true }
})

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

const ME = {
  id: 'preview-user-1',
  name: 'Preview Blorper',
  username: 'preview_blorper_4242',
  avatar_url: null,
  score: 4242,
}

const POSTS = [
  {
    id: 'p1', user_id: 'preview-user-1',
    content: 'asdjhaksjdhasdjhaksjdh',
    description: 'This person was thinking about soup when they wrote this',
    created_at: new Date(Date.now() - 30000).toISOString(),
    username: 'preview_blorper_4242', name: 'Preview Blorper', avatar_url: null,
  },
  {
    id: 'p2', user_id: 'user-chaos',
    content: 'I am posting things onto the internet and I am fine with this',
    description: 'Certified meaningless by the Ministry of Whatever',
    created_at: new Date(Date.now() - 90000).toISOString(),
    username: 'void_walker_9999', name: 'Void Walker', avatar_url: null,
  },
  {
    id: 'p3', user_id: 'user-beige',
    content: 'hello world',
    description: 'Vibe: a damp sock',
    created_at: new Date(Date.now() - 200000).toISOString(),
    username: 'beige_energy_3333', name: 'Beige Energy', avatar_url: null,
  },
  {
    id: 'p4', user_id: 'user-moist',
    content: 'fjdkslfjdklsfjdklsf something something fjdkslf',
    description: 'Written at a moment of extreme beige energy',
    created_at: new Date(Date.now() - 400000).toISOString(),
    username: 'moist_tuesday_1111', name: 'Moist Tuesday', avatar_url: null,
  },
]

const LEADERBOARD = [
  { id: 'user-chaos', name: 'Void Walker', username: 'void_walker_9999', avatar_url: null, score: 9841 },
  { id: 'user-beige', name: 'Beige Energy', username: 'beige_energy_3333', avatar_url: null, score: 7723 },
  { ...ME },
  { id: 'user-moist', name: 'Moist Tuesday', username: 'moist_tuesday_1111', avatar_url: null, score: 2111 },
]

app.get('/api/me', (req, res) => res.json(ME))
app.get('/api/posts/global', (req, res) => res.json(POSTS))
app.get('/api/posts/friends', (req, res) => res.json(POSTS.slice(0, 2)))
app.post('/api/posts', (req, res) => {
  const p = {
    id: Date.now().toString(), user_id: ME.id,
    content: req.body.content,
    description: 'Our scientists analyzed this and found: nothing',
    created_at: new Date().toISOString(),
    username: ME.username, name: ME.name, avatar_url: ME.avatar_url,
  }
  POSTS.unshift(p)
  io.emit('new_post', p)
  res.json(p)
})
app.post('/api/posts/chaos', (req, res) => {
  io.emit('mass_score_shuffle', { updates: LEADERBOARD.map(u => ({ userId: u.id, newScore: Math.floor(Math.random() * 9999) })) })
  res.json({ ok: true })
})
app.get('/api/friends', (req, res) => res.json([LEADERBOARD[0]]))
app.post('/api/friends/:id', (req, res) => res.json({ ok: true }))
app.delete('/api/friends/:id', (req, res) => res.json({ ok: true }))
app.get('/api/users/search', (req, res) => res.json(LEADERBOARD.slice(0, 3)))
app.get('/api/leaderboard/global', (req, res) => res.json(LEADERBOARD))
app.get('/api/leaderboard/friends', (req, res) => res.json(LEADERBOARD.slice(0, 2)))

io.on('connection', socket => {
  socket.on('join_user_room', () => {})
})

// Simulate score updates
setInterval(() => {
  const entry = LEADERBOARD[Math.floor(Math.random() * LEADERBOARD.length)]
  const delta = Math.floor(Math.random() * 60) - 30
  entry.score = Math.max(0, entry.score + delta)
  const reasons = ['a cat sneezed', 'mercury is in retrograde', 'you breathed', 'the void giggled']
  io.emit('score_update', {
    userId: entry.id,
    newScore: entry.score,
    delta,
    reason: reasons[Math.floor(Math.random() * reasons.length)]
  })
  io.emit('leaderboard_update', { entries: [...LEADERBOARD].sort((a, b) => b.score - a.score) })
}, 3000)

// Simulate vibe changes
const VIBES = ['chaotic', 'moist', 'beige', 'uncertain', 'crispy']
setInterval(() => {
  io.emit('vibe_change', { vibe: VIBES[Math.floor(Math.random() * VIBES.length)] })
}, 5000)

server.listen(3001, () => console.log('Mock BLORP server on :3001'))
