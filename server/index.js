const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { resolve } = require('path')
const createQr = require('./createQr.js')

app.get('/', (req, res) => {
  res.sendFile(resolve(`${__dirname}/../static/index.html`))
})

app.get('/:file', (req, res) => {
  res.sendFile(resolve(`${__dirname}/../static/${req.params.file}`))
})

app.get('/assets/:file', (req, res) => {
  res.sendFile(resolve(`${__dirname}/../assets/${req.params.file}`))
})

io.on('connection', socket => {
  console.log('new connection')

  socket.on('create-qr', () => {
    const roomId = '' + 1//Math.floor(Math.random()*9999)
    socket.join(roomId)
    console.log('presentation joins room: ' + roomId)
    socket.emit('qr-created', createQr(roomId), roomId)
  })

  socket.on('control-connected', (roomId) => {
    socket.join(roomId)
    console.log('control joins room: ' + roomId)
    socket.emit('control-connected')
    socket.on('presentation-start', (jsonPath) => {
      socket.to(roomId).emit('presentation-start', jsonPath)
    })
    socket.on('go-to-next', () => {
      socket.to(roomId).emit('go-to-next')
    })
    socket.on('go-to-prev', () => {
      socket.to(roomId).emit('go-to-prev')
    })
  })
})

server.listen(process.env.PORT || 3000)
