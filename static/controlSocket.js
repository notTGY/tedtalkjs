import { DOMAIN } from './params.js'
import {
  loadPresentation,
  prepareImages,
  goToN
} from './presentation.js'

async function startPresentation(path) {
  const slidesControl = document.getElementById('slides-control')
  slidesControl.innerHTML = ''
  const slidePreview = document.getElementById('slide-preview')
  let n = 0
  const res = await fetch(path)
  const data = await res.json()
  const images = prepareImages(data)
  loadPresentation(slidePreview, data, images)
  data.forEach((item, index) => {
    const sl = document.createElement('div')
    sl.classList.add('preview')
    sl.classList.add('list')
    loadPresentation(sl, data, images, index)
    slidesControl.append(sl)
  })
  const goNext = e => {
    if (n < data.length - 1) n++
    loadPresentation(slidePreview, data, images, n)
  }
  const goPrev = e => {
    if (n > 0) n--
    loadPresentation(slidePreview, data, images, n)
  }
  const goN = i => {
    if (i >= 0 && i <= data.length - 1) n = i
    loadPresentation(slidePreview, data, images, n)
  }
  return [goNext, goPrev, goN]
}

export default function controlSocket(socket, roomId) {
  document.querySelector('main').innerHTML = `
    <section id="slides-control">
    </section>
    <div id="slide-preview" class="preview">
    </div>
    <button id="prev-slide">
    </button>
    <button id="next-slide">
    </button>
    <button id="toggle-preview">
    </button>
    <div id="qrcode"></div>
  `


  let clickTimeout = 0
  socket.on('control-connected', async () => {
    socket.emit('presentation-start', `${DOMAIN}/assets/test.json`)
    const [next, prev, n] = await startPresentation(`${DOMAIN}/assets/test.json`)

    const fn = e => {
      if (clickTimeout) {
        clearTimeout(clickTimeout)
        clickTimeout = 0
        socket.emit('go-to-prev')
        prev()
      } else {
        clickTimeout = setTimeout(
          e => {
            socket.emit('go-to-next')
            next()
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
