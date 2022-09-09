const buildJS = require('./buildJS.js') // compile frontend

//--- server logic ---
const { resolve } = require('path')
const express = require('express')
const app = express()

const server = require('http').Server(app)

const io = require('socket.io')(server)

const socketFlow = require('./socketFlow.js')
io.on('connection', socketFlow)

app.get('/', (req, res) => {
  res.sendFile(
    resolve(`${__dirname}/../src/index.html`)
  )
})

app.get('/index.js', (req, res) => {
  res.sendFile(
    resolve(`${__dirname}/../server/cache.js`)
  )
})

app.get('/:file', (req, res) => {
  res.sendFile(
    resolve(`${__dirname}/../src/${req.params.file}`)
  )
})

app.get('/:dir/:file', (req, res) => {
  const { file, dir } = req.params
  if (dir !== 'assets') {
    const path = resolve(`${__dirname}/../src/${dir}/${file}`)
    res.sendFile(path)
    return
  }
  const path = resolve(`${__dirname}/../assets/${file}`)
  res.sendFile(path)
})

const port = process.env.PORT || 3000
server.listen(
  port,
  () => console.log('listening on port ' + port),
)
