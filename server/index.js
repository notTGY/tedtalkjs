const express = require('express')
const app = express()

const server = require('http').Server(app)

const io = require('socket.io')(server)
const socketFlow = require('./socketFlow.js')
io.on('connection', socketFlow)


const restApi = require('./restApi.js')
restApi(app)

server.listen(process.env.PORT || 3000)
