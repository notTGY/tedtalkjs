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
    socket.emit('qr-created', createQr())
  })

})

server.listen(process.env.PORT || 3000)
