const slideCounter = document.getElementById('slide-counter')
const mainContent = document.getElementById('main-content')
const leftContent = document.getElementById('left-align-content')
const heading = document.getElementById('heading')
const imgRow1 = document.getElementById('img-row-1')
const imgRow2 = document.getElementById('img-row-2')
const imgWhole = document.getElementById('img-whole')
const qrcanvas = document.getElementById('qrcode')

const displayStandaloneSentence = (sentence) => {
  const txt = sentence.trim()
  if (txt.length < 50)
    mainContent.innerHTML = txt
  else
    leftContent.innerHTML = txt
}

const displayText = (text) => {
  leftContent.innerHTML = text.reduce((acc, e, i) => {
    if (e[0] === '*') {
      const txt = e.substring(1).trim()
      return acc + `<ul><li>${txt}</li></ul>`
    }
    return acc + e + '<br>'
  }, '')
}

const plotSlide = (slideData, n) => {
  slideCounter.innerText = n.toString()
  mainContent.innerHTML = ''
  leftContent.innerHTML = ''
  heading.innerHTML = ''
  imgRow1.hidden = true
  imgRow2.hidden = true
  imgWhole.hidden = true
  qrcanvas.hidden = true

  if (['boolean', 'number', 'string'].includes(typeof slideData))
    return displayStandaloneSentence(slideData.toString())

  if (Array.isArray(slideData))
    return displayText(slideData)

  return displayJSON(slideData)
}
