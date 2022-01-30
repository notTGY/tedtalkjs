import displayQr from './displayQr.js'
import generatePage from './page.js'

export default function presentationSocket(socket) {
  const main = document.querySelector('main')
  let slideData = []
  let curSlide = 0

  function render() {
    main.innerHTML = generatePage(slideData, curSlide)
  }
  render()

  const slide = document.getElementById('slide')

  socket.on('qr-created', (qr, id) => {
    console.log(id)
    displayQr(qr)
  })

  socket.on('presentation-start', (data) => {
    slideData = data.slideData
    curSlide = data.curSlide
    render()
  })

  socket.on('go-to-slide', n => {
    curSlide = n
    render()
  })

  socket.emit('create-qr')
}
