module.exports = function attachSocketHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('join_user_room', (userId) => {
      if (typeof userId === 'string' && userId.length < 128) {
        socket.join(`user:${userId}`)
      }
    })
  })
}
