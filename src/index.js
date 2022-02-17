import './lib/socket.io.min.js'
import {
  DOMAIN, roomId, mode, CTRL, POLL, PRES,
} from './params.js'
import presentationSocket from './presentation/index.js'
import controlSocket from './control/index.js'
import pollSocket from './poll/index.js'

const socket = io()

if (mode === CTRL)
  controlSocket(socket, roomId)
else if (mode === PRES)
  presentationSocket(socket)
else if (mode === POLL)
  pollSocket(socket, roomId)
else {
  console.log('unexpected url, probably should 404')
}
