const CTRL = 'ctrl'
const POLL = 'poll'
const PRES = 'pres'

const { origin, search } = document.location
const params = new URLSearchParams(search)


const ctrl = params.get(CTRL)
const poll = params.get(POLL)

const roomId = ctrl || poll || null
let mode
if (ctrl) mode = CTRL
else if (poll) mode = POLL
else mode = PRES


const DOMAIN = origin.indexOf('localhost') === -1
  ? 'https://tedtalkjs.herokuapp.com'
  : 'http://localhost:3000'

export { DOMAIN, roomId, mode, CTRL, POLL, PRES }

