const qr = require('qr.js')

function createQr(id) {
  const qrcode = qr(
    process.env.PORT
    ?`http://tedtalkjs.herokuapp.com/#${id}`
    :`http://localhost:3000/#${id}`
  )

  return qrcode
}

module.exports = createQr
