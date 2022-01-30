import { DOMAIN, isLocal, roomId } from './params.js'
import presentationSocket from './presentation/index.js'
import controlSocket from './control/index.js'

const socket = io()

if (roomId)
  controlSocket(socket, roomId)
else
  presentationSocket(socket)
