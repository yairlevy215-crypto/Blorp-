# BLORP

> the social network for people who exist

A full-stack absurdist social media app. Post anything. Get described in ways you cannot control. Watch your score change for no reason. Press a button you shouldn't press.

---

## Features

- **Google OAuth** — login only with Google, no passwords
- **Post anything** — your post gets an AI-generated (or randomly assigned) absurd description
- **Global + Friends feed** — real-time via Socket.io
- **Random score chaos** — scores update every few seconds with absurd reasons
- **DO NOT PRESS button** — reshuffles all scores globally
- **Global + Friends leaderboard** — updated in real time
- **Breaking news ticker** — important updates like "Man still exists"
- **Global vibe indicator** — cycling: chaotic, moist, beige, uncertain, crispy...
- **Countdown to nothing** — it counts down to something
- **Reaction sounds** — synthesized via Web Audio API, no files needed

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL via Supabase |
| Real-time | Socket.io |
| Auth | Passport.js + Google OAuth 2.0 |
| AI | Claude API (claude-haiku) — optional |

---

## Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- A [Google Cloud](https://console.cloud.google.com) project

---

### 1. Clone & install

```bash
git clone <repo>
cd dream-room

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

---

### 2. Set up the database (Supabase)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in the Supabase dashboard
3. Copy and paste the contents of `server/db/schema.sql` and run it
4. Go to **Settings → Database → Connection string → URI**
   - Use the **Session mode pooler** URL (looks like `postgresql://postgres.PROJECTID:PASSWORD@aws-0-region.pooler.supabase.com:5432/postgres`)

---

### 3. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Enable the **Google+ API** (search in API library)
4. Go to **Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add authorized redirect URI: `http://localhost:3001/auth/google/callback`
7. Copy the **Client ID** and **Client Secret**

---

### 4. Configure environment

```bash
cd server
cp ../.env.example .env
```

Edit `server/.env`:

```env
DATABASE_URL=postgresql://postgres.YOURPROJECTID:PASSWORD@aws-0-region.pooler.supabase.com:5432/postgres
SESSION_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
CLIENT_URL=http://localhost:5173
PORT=3001
NODE_ENV=development

# Optional: AI-generated post descriptions
# Get an API key at https://console.anthropic.com/
ANTHROPIC_API_KEY=
```

---

### 5. Run

In two terminals:

```bash
# Terminal 1 — backend
cd server
npm run dev
# Server starts on http://localhost:3001
```

```bash
# Terminal 2 — frontend
cd client
npm run dev
# Client starts on http://localhost:5173
```

Open `http://localhost:5173` and blorp.

---

## Production Deployment

### Environment changes for production

In `server/.env`:
```env
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/auth/google/callback
```

Update the Google OAuth redirect URI in Google Cloud Console to match your production callback URL.

Cookie settings automatically switch to `secure: true` and `sameSite: 'none'` when `NODE_ENV=production`.

### Build the frontend

```bash
cd client && npm run build
# Outputs to client/dist/
```

Serve `client/dist` from nginx/Caddy, or deploy to Vercel/Netlify. Point the backend URL via environment variables or the Vite proxy configuration.

---

## Project Structure

```
dream-room/
├── server/
│   ├── index.js              main entry point
│   ├── db/
│   │   ├── client.js         PostgreSQL pool
│   │   └── schema.sql        CREATE TABLE statements
│   ├── routes/
│   │   ├── auth.js           Google OAuth + passport config
│   │   ├── posts.js          post CRUD, feeds, chaos endpoint
│   │   ├── friends.js        friend management
│   │   ├── users.js          user search
│   │   └── leaderboard.js    rankings
│   ├── socket/
│   │   └── handlers.js       Socket.io connection handler
│   ├── services/
│   │   ├── descriptions.js   absurd post description generator
│   │   └── scoreRandomizer.js random score chaos engine
│   └── middleware/
│       └── auth.js           isAuthenticated guard
│
└── client/
    ├── src/
    │   ├── App.jsx
    │   ├── hooks/            useAuth, useSocket, useScoreFloat
    │   ├── components/
    │   │   ├── Layout/       AppShell, NewsTicker, GlobalVibe, Countdown
    │   │   ├── Auth/         LoginPage
    │   │   ├── Posts/        Feed, PostCard, PostComposer
    │   │   ├── Friends/      FriendSearch, FriendsList
    │   │   ├── Leaderboard/  GlobalLeaderboard, FriendsLeaderboard
    │   │   └── Score/        ScoreDisplay, ScoreFloater
    │   ├── pages/            Home, Leaderboard
    │   └── utils/            absurdContent.js, sounds.js
    └── (config files)
```

---

## Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `new_post` | server → all | New post created |
| `score_update` | server → all | One user's score changed |
| `mass_score_shuffle` | server → all | DO NOT PRESS was pressed |
| `leaderboard_update` | server → all | Fresh top-50 rankings |
| `vibe_change` | server → all | Global vibe word changed |
| `join_user_room` | client → server | Join personal notification room |

---

## The Important Question

**Why does my score keep changing?**

Because a cat sneezed. Or Mercury is in retrograde. Or the algorithm felt like it. There is no logic. There never was.
