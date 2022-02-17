import { render } from './page.js'

export default function pollSocket(socket, roomId) {
  function send(str) {
    socket.emit('send-feedback', str)
  }

  render()

  const button = document.querySelector('button')
  const input = document.querySelector('input')
  button.addEventListener('click', e => {
    send(input.value)
    input.value = ''
  })

}
