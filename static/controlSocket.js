import { DOMAIN } from './params.js'

export default function controlSocket(socket, roomId) {
  let clickTimeout = 0
  socket.on('control-connected', () => {
    socket.emit('presentation-start', `${DOMAIN}/assets/test.json`)

    const fn = e => {
      if (clickTimeout) {
        clearTimeout(clickTimeout)
        clickTimeout = 0
        socket.emit('go-to-prev')
      } else {
        clickTimeout = setTimeout(
          e => {
            socket.emit('go-to-next')
            clickTimeout = 0
          },
          300
        )
      }
    }

    document.body.addEventListener('keydown', fn)
    document.body.addEventListener('click', fn)
    document.body.addEventListener('touchstart', fn)
  })

  socket.emit('control-connected', roomId)
}
