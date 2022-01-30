import paint from '../lib/paint.js'

export default function render(slideData, n) {
  let qr
  if (!slideData.length) qr = `
    <section id="center">
      <canvas id="qrcode"/>
    </section>`

  const slide = paint(slideData[n]) || ''

  return `
  <section id="slide">${slide}</section>
  ${qr}

  <style>
    html, body, main, #slide { width: 100%; height: 100%; margin: 0; }
    #center { position: fixed; top: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
    #center canvas { width: 100px; height: 100px; }

    #slide { display: flex; justify-content: center; }
  </style>
  `
}
