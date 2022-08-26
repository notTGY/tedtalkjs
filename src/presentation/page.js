import paint from '../lib/paint.js'

export default function render(slideData, n) {
  let qr
  if (!slideData.length) qr = `
      <h1 id="headline"> Scan code to start presentation </h1>
    <div id="back">
      <img src="./assets/back.png"/>
    </div>
    <section id="center">
      <canvas id="qrcode"/>
    </section>`

  const slide = paint(slideData[n]) || ''

  return `
  <section id="slide">${slide}</section>
  ${qr}

  <style>
    html, body, main, #slide { width: 100%; height: 100%; margin: 0; }
    #center { position: fixed; top: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    #center canvas { width: 150px; height: 150px; z-index: 1; margin-bottom: 70px; image-rendering: pixelated;}

    #slide { display: flex; justify-content: center; }
    #back { position: fixed; top: 50%; left: 50%; transform: translate(calc(-50% - 145px), calc(-50% + 70px)); display: flex; flex-direction: column; align-items: center;}
    #back img { width: 640; height: 640; }
    #headline { position: fixed; top: 50%; left: 50%; transform: translate(-50%, calc(-50% - 280px)); display: flex; flex-direction: column; align-items: center; font-weight: 500; color: #121231; font-size: 24px; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; }
  </style>
  `
}
