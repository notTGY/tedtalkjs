let DOMAIN
if (document.location.origin.indexOf('localhost') !== -1) {
  DOMAIN = 'http://localhost:3000'
} else {
  DOMAIN = 'https://tedtalkjs.herokuapp.com'
}
