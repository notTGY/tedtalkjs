let DOMAIN
if (document.location.origin.indexOf('localhost') !== -1) {
  DOMAIN = 'htto://localhost:3000'
} else {
  DOMAIN = 'htto://tedtalkjs.herokuapp.com'
}
