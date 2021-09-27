fetch('./test.json').then(res => res.json()).then(loadPresentation)

function loadPresentation(data) {
  console.log('data: ', data)
  const displaySlide = (n) => {
    if (plotSlide)
      plotSlide(data[n], n)
    else
      document.body.innerHTML = data[n]

    if (updateTransitions) {
      const next = e => {
        if (n < data.length-1) displaySlide(n+1)
      }

      const prev = e => {
        if (n > 0) displaySlide(n-1)
      }

      updateTransitions(prev, next)
    } else {
      throw new Error('connect interactive part of the js')
    }
  }

  displaySlide(0)
}
