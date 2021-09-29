if (document.location.hash !== '')
  initControl(document.location.hash.substring(1))
else
  initPresentation()

function initPresentation() {
  const socket = io()

  socket.on('qr-created', (qr, id) => {
    console.log(id)
    displayQr(qr)
  })

  socket.on('presentation-start', (jsonPath) => {
    fetch(jsonPath)
      .then(res => res.json()).then(loadPresentation)
  })

  socket.on('go-to-next', () => goToNext())
  socket.on('go-to-prev', () => goToPrev())

  socket.emit('create-qr')
}

let clickTimeout = 0
function initControl(roomId) {
  const socket = io()

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

function displayQr(qrcode) {
  const qrcanvas = document.getElementById('qrcode')
  const ctx = qrcanvas.getContext('2d')
  const data = qrcode.modules
  const size = data.length
  qrcanvas.width = qrcanvas.height = size + 2
  const imageData = ctx.createImageData(size,size)
  data.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const index = 4*(rowIndex*size + cellIndex)
      imageData.data[index] = 0
      imageData.data[index+1] = 0
      imageData.data[index+2] = 0
      imageData.data[index+3] = cell*255
    })
  })
  ctx.putImageData(imageData, 1, 1)
}
