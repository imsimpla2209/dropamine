import { createContext, useContext, useEffect } from 'react'
import { io } from 'socket.io-client'
import { SERVER_ENPOINT } from '../api/server-url'

const socket = io(SERVER_ENPOINT, {
  transports: ['websocket', 'polling'],
})

const SocketContext = createContext(null)

export const SocketProvider = props => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected')
    })

    return () => {
      socket.off('connect')
    }
  }, [])

  return <SocketContext.Provider value={{ appSocket: socket }}>{props.children}</SocketContext.Provider>
}

export const useSocket = () => {
  const { appSocket } = useContext(SocketContext)
  return {
    appSocket,
  }
}
