const DB_CLICK_TIMEOUT = 300

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
