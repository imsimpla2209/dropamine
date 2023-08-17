import { Server } from 'socket.io'

export let io

export function createSocketIO(server) {
  io = new Server(server)

  io.on('connection', socket => {
    socket.on('disconnect', () => {
      console.log('SOCKET DISCONNECTED')
    })

    socket.emit('message', {
      message: 'Welcome to the Socket.IO Server',
    })
  })
}
