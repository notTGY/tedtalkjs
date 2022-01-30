const express = require('express')
const app = express()

const server = require('http').Server(app)

const io = require('socket.io')(server)
const socketFlow = require('./socketFlow.js')
io.on('connection', socketFlow)


const restApi = require('./restApi.js')
restApi(app)

const port = process.env.PORT || 3000
server.listen(
  port,
  () => console.log('listening on port ' + port),
)
