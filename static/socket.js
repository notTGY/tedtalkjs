const SIZE = 300

function init() {
  if (document.location.hash !== '')
    initControl()
  else
    initPresentation()
}

init()


function initPresentation() {
  console.log('init presentation')
  const socket = io("localhost:3000")

  socket.on('qr-created', (qr) => {
    console.log(qr)
    displayQr(qr)
  })

  socket.on('start-presentation', () => {
    fetch('../assets/test.json')
      .then(res => res.json()).then(loadPresentation)
  })

  socket.emit('create-qr')
}

function initControl() {
  console.log('init control')
  const socket = io("localhost:3000")

  socket.emit('start-presentation')
}


function displayQr(qrcode) {
  const qrcanvas = document.getElementById('qrcode')
  const ctx = qrcanvas.getContext('2d')

  const data = qrcode.modules
  const size = data.length

  qrcanvas.width = qrcanvas.height = size

  const imageData = ctx.createImageData(size,size)

  data.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const index = 4*(rowIndex*size + cellIndex)
      imageData.data[index] = 0
      imageData.data[index+1] = 0
      imageData.data[index+2] = 0
      imageData.data[index+3] = (!cell)*255
    })
  })
  ctx.putImageData(imageData, 0, 0)
}
