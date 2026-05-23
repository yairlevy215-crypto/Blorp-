import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './useAuth'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { user } = useAuth()
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!user) return
    const s = io({ withCredentials: true })
    s.on('connect', () => {
      s.emit('join_user_room', user.id)
    })
    setSocket(s)
    return () => s.disconnect()
  }, [user?.id])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export function useSocket() {
  return useContext(SocketContext)
}
