import happyFramework from '../framework.js'

function displayQr(qrcode) {
  const qrcanvas = document.getElementById('qrcode')
  const ctx = qrcanvas.getContext('2d')
  ctx.imageSmoothingEnabled = false
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

export default function icon(props) {
  const { children, width, qrcode } = props
  const styleSizes = 
    `width: ${width}px; height: ${width}px`
  const styleCanvas = 
    `width: ${width * .4}px; height: ${width * .4}px;`
    + `position: relative; top: ${-width * .75}; left: ${width * .3}`

  if (qrcode) {
    setTimeout(() => displayQr(qrcode), 100)
  }

  return {
    elem: 'div',
    style: styleSizes,
    children: [
      <img style={styleSizes} src="/assets/pres.svg"/>,
      <canvas style={styleCanvas} id="qrcode"/>
    ],
  }
}
