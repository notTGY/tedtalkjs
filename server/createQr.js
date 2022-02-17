const qr = require('qr.js')

function createQr(id, mode) {
  const path = `?${mode}=${id}`

  const qrcode = qr(
    process.env.PORT
    ?`https://tedtalkjs.herokuapp.com/${path}`
    :`http://localhost:3000/${path}`
  )

  return qrcode
}

module.exports = createQr
