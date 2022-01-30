export default function displayQr(qrcode) {
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

