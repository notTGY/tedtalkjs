const slideCounter = document.getElementById('slide-counter')
const mainContent = document.getElementById('main-content')

const displayStandaloneSentence = (sentence) => {
  mainContent.innerText = sentence
}

const displayText = (text) => {
  mainContent.innerText = text.join('<br>')
}

const plotSlide = (slideData, n) => {
  slideCounter.innerText = n.toString()
  if (['boolean', 'number', 'string'].includes(typeof slideData))
    return displayStandaloneSentence(slideData.toString())

  if (Array.isArray(slideData))
    return displayText(slideData)

  return displayJSON(slideData)
}
