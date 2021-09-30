import displayQr from './displayQr.js'
import {
  loadPresentation,
  goToNext,
  goToPrev,
  goToN
} from './presentation.js'

const qrcanvas = document.getElementById('qrcode')
const slide = document.getElementById('slide')

const mainContent = slide.getElementsByClassName('main-content')[0]
const leftContent = slide.getElementsByClassName('left-align-content')[0]
const heading = slide.getElementsByClassName('heading')[0]
const imgRow1 = slide.getElementsByClassName('img-row-1')[0]
const imgRow2 = slide.getElementsByClassName('img-row-2')[0]
const imgWhole = slide.getElementsByClassName('img-whole')[0]

const nodes = {
  mainContent,
  leftContent,
  heading,
  imgRow1,
  imgRow2,
  imgWhole,
  qrcanvas,
}

export default function presentationSocket(socket) {
  socket.on('qr-created', (qr, id) => {
    console.log(id)
    displayQr(qr)
  })

  socket.on('presentation-start', (jsonPath) => {
    fetch(jsonPath)
      .then(res => res.json()).then(data => {
        loadPresentation(nodes, data)
      })
  })

  socket.on('go-to-next', () => goToNext())
  socket.on('go-to-prev', () => goToPrev())

  socket.emit('create-qr')
}
