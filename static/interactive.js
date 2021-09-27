const DB_CLICK_TIMEOUT = 200

const updateTransitions = (prev, next) => {
  let clickTimeout = 0
  onkeydown = onclick = e => {
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      prev()
    } else {
      clickTimeout = setTimeout(next, DB_CLICK_TIMEOUT)
    }
  }
}
