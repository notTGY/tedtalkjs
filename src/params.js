let DOMAIN, isLocal, roomId
if (document.location.origin.indexOf('localhost') !== -1) {
  DOMAIN = 'http://localhost:3000'
  isLocal = true
} else {
  DOMAIN = 'https://tedtalkjs.herokuapp.com'
  isLocal = false
}

if (document.location.hash !== '') {
  roomId = document.location.hash.substring(1)
} else {
  roomId = null
}

export { DOMAIN, isLocal, roomId }

