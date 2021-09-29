goToNext = e => console.log('hi')
goToPrev = e => console.log('hi')

function loadPresentation(data) {
  console.log('data: ', data)
  const displaySlide = (n) => {
    if (plotSlide)
      plotSlide(data[n], n)
    else
      document.body.innerHTML = data[n]

    goToNext = e => {
      if (n < data.length-1) displaySlide(n+1)
    }
    goToPrev = e => {
      if (n > 0) displaySlide(n-1)
    }
  }

  displaySlide(0)
}

onclick = e => {
  if (document.location.hash === '')
    document.querySelector('main').requestFullscreen()
}
