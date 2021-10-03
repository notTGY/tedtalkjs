import plotSlide from './visual.js'

let goToNext = e => console.log('hi')
let goToPrev = e => console.log('hi')
let goToN = e => console.log('hi')

function prepareImages(data) {
  let images = {}
  data.forEach(slide => {
    if (typeof slide == 'object' && !Array.isArray(slide)) {
      if ('img' in slide) {
        fetch(slide.img)
          .then(res => res.blob())
          .then(obj => URL.createObjectURL(obj))
          .then(imageURL => images[slide.img] = imageURL)
      }
      if ('img2' in slide) {
        fetch(slide.img2)
          .then(res => res.blob())
          .then(obj => URL.createObjectURL(obj))
          .then(imageURL => images[slide.img2] = imageURL)
      }
    }
  })
  return images
}

function loadPresentation(slide, data, images, startingNum=0) {
  const displaySlide = (n) => {
    plotSlide(slide, data[n], images)

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

  document.getElementById('qrcode').hidden = true
  displaySlide(startingNum)
}

onclick = e => {
  if (document.location.hash === '')
    document.querySelector('main').requestFullscreen()
}

export {
  goToNext,
  goToPrev,
  loadPresentation,
  prepareImages,
  goToN,
}
