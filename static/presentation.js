import plotSlide from './visual.js'

let goToNext = e => console.log('hi')
let goToPrev = e => console.log('hi')
let goToN = e => console.log('hi')

function loadPresentation(nodes, data) {
  const displaySlide = (n) => {
    if (plotSlide)
      plotSlide(nodes, data[n])
    else
      document.body.innerHTML = data[n]

    goToNext = e => {
      if (n < data.length-1) displaySlide(n+1)
    }
    goToPrev = e => {
      if (n > 0) displaySlide(n-1)
    }

    goToN = i => {
      if (i > data.length-1) {
        displaySlide(data.length-1)
      } else if (i < 0) {
        displaySlide(0)
      } else {
        displaySlide(i)
      }
    }
  }

  displaySlide(0)
}

onclick = e => {
  if (document.location.hash === '')
    document.querySelector('main').requestFullscreen()
}

export { goToNext, goToPrev, loadPresentation, goToN }
