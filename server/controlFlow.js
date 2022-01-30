function controlFlow(socket, roomId) {
  socket.on('presentation-start', data => {
    socket.to(roomId).emit('presentation-start', data)
  })

  socket.on('go-to-slide', n => {
    socket.to(roomId).emit('go-to-slide', n)
  })
}

module.exports = controlFlow
