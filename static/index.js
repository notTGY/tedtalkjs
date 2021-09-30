import { DOMAIN, isLocal, roomId } from './params.js'
import presentationSocket from './presentationSocket.js'
import controlSocket from './controlSocket.js'

const socket = io()

if (roomId)
  controlSocket(socket, roomId)
else
  presentationSocket(socket)
