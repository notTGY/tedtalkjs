function controlFlow(socket, roomId) {
  socket.on('presentation-start', (jsonPath) => {
    socket.to(roomId).emit('presentation-start', jsonPath)
  })

  socket.on('go-to-next', () => {
    socket.to(roomId).emit('go-to-next')
  })

  socket.on('go-to-prev', () => {
    socket.to(roomId).emit('go-to-prev')
  })
}

module.exports = controlFlow
