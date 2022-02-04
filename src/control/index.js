import { DOMAIN } from '../params.js'
import { render, add } from './page.js'

function save(state) {
  localStorage.setItem('pres', JSON.stringify(state))
}
function load() {
  let data
  try {
    data = JSON.parse(localStorage.getItem('pres'))
  } catch(e) {
    data = null
  }
  return data || ['']
}

export default function controlSocket(socket, roomId) {
  const slideData = load()
  let curSlide = 0

  function sendPres() {
    socket.emit(
      'presentation-start',
      { slideData, curSlide }
    )
  }

  function goToN(n) {
    socket.emit('go-to-slide', n)
  }

  function textareaCb(textarea, index) {
    textarea.addEventListener('input', e => {
      const text = e.target.value

      slideData[index] = text
      curSlide = index

      render(slideData, curSlide)

      save(slideData)
      sendPres()
    })

    textarea.addEventListener('focus', e => {
      curSlide = index

      render(slideData, curSlide)

      goToN(index)
    })

    textarea.addEventListener('keyup', e => {
      const { key } = e
      if (key === 'Backspace' || key === 'Delete') {
        if (textarea.value === '') {
          slideData.splice(index, 1)

          const texts = document.querySelectorAll('textarea')
          texts[texts.length - 1].parentElement.remove()

          render(slideData, curSlide)

          save(slideData)
          sendPres()
        }
      }
    })
  }

  render(slideData, curSlide)

  const textareas = document.querySelectorAll('textarea')
  const slides = document.querySelectorAll('.slide')
  const plus = document.getElementById('plus')

  plus.addEventListener('click', e => {
    add(slideData.length, textareaCb)
    slideData.push('')

    render(slideData, curSlide)

    save(slideData)
  })
  textareas.forEach(textareaCb)

  socket.on('control-connected', sendPres)

  socket.emit('control-connected', roomId)
}
