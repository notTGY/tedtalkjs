const qr = require('qr.js')

function createQr() {
  const url = `http://localhost:3000/#${Math.floor(9999*Math.random())}`
  const qrcode = qr(url, {errorCorrectLevel: 2})

  return qrcode
}

module.exports = createQr
