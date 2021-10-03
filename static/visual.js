import displayJSON from './complexObject.js'

const plotSlide = (slide, slideData, images) => {
  if (['boolean', 'number', 'string'].includes(typeof slideData))
    return displayStandaloneSentence(slide, slideData)

  if (Array.isArray(slideData))
    return displayText(slide, slideData)

  return displayJSON(slide, slideData, images)
}

const displayStandaloneSentence = (slide, sentence) => {
  const txt = sentence.toString().trim()
  slide.innerHTML = `
    <section class="center main-content">
      ${txt}
    </section>
  `
}

const displayText = (slide, text) => {
  const content = text.reduce((acc, e, i) => {
    if (e[0] === '*') {
      const txt = e.substring(1).trim()
      return acc + `
        <ul class="custom-ul">
          <li class="custom-li">${txt}</li>
        </ul>
      `
    }
    return acc + '<p>' + e + '</p>'
  }, '')
  slide.innerHTML = `
    <div class="center">
      <div class="left-align-content">
        ${content}
      </div>
    </div>
  `
}

export default plotSlide
