const createQr = require('./createQr.js')
const controlFlow = require('./controlFlow.js')

const rooms = {}

function socketFlow(socket) {
  console.log('new connection')

  socket.on('create-room', () => {
    const roomId = '' + 1// + Math.floor(Math.random()*9999)
    rooms[roomId] ??= {}
    const mode = 'ctrl'
    console.log('presentation joins room: ' + roomId)
    socket.join(roomId)
    const qr = createQr(roomId, mode)
    socket.emit('room-created', qr, roomId)
  })

  socket.on('control-requested', roomId => {
    socket.join(roomId)

    rooms[roomId] ??= {}
    if (rooms[roomId].control) {
      return
    }
    console.log('control joins room: ' + roomId)

    rooms[roomId].control = true

    socket.on('disconnect', () => {
      console.log('disconnected')
      rooms[roomId].control = false
    })

    socket.emit('control-connected')

    controlFlow(socket, roomId)
  })
}

module.exports = socketFlow
