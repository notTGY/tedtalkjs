const createQr = require('./createQr.js')
const controlFlow = require('./controlFlow.js')

function socketFlow(socket) {
  console.log('new connection')

  socket.on('create-room', () => {
    const roomId = '' + 1// + Math.floor(Math.random()*9999)
    const mode = 'ctrl'
    console.log('presentation joins room: ' + roomId)
    socket.join(roomId)
    const qr = createQr(roomId, mode)
    socket.emit('room-created', qr, roomId)
  })

  socket.on('control-connected', roomId => {
    console.log('control joins room: ' + roomId)
    socket.join(roomId)
    socket.emit('control-connected')

    controlFlow(socket, roomId)
  })
}

module.exports = socketFlow
