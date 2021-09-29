const qr = require('qr.js')

function createQr(id) {
  const qrcode = qr(
    process.env.PORT
    ?`http://localhost:3000/#${id}`
    :`http://tedtalkjs.herokuapp.com/#${id}`
  )

  return qrcode
}

module.exports = createQr
