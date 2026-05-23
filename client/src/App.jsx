import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { SocketProvider } from './hooks/useSocket'
import AppShell from './components/Layout/AppShell'
import LoginPage from './components/Auth/LoginPage'
import Home from './pages/Home'
import LeaderboardPage from './pages/Leaderboard'

function ProtectedLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="font-glitch text-4xl text-neon animate-pulse">BLORP</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <SocketProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </SocketProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
