import displayQr from './displayQr.js'
import {
  loadPresentation,
  prepareImages,
  goToNext,
  goToPrev,
  goToN
} from './presentation.js'

export default function presentationSocket(socket) {
  document.querySelector('main').innerHTML = `
    <section id="slide"></section>
    <div class="center"><canvas id="qrcode" /></div>
  `

  const slide = document.getElementById('slide')


  socket.on('qr-created', (qr, id) => {
    console.log(id)
    displayQr(qr)
  })

  socket.on('presentation-start', (jsonPath) => {
    fetch(jsonPath)
      .then(res => res.json()).then(data => {
        const images = prepareImages(data)
        loadPresentation(slide, data, images)
      })
  })

  socket.on('go-to-next', () => goToNext())
  socket.on('go-to-prev', () => goToPrev())

  socket.emit('create-qr')
}
