import displayJSON from './complexObject.js'

const displayStandaloneSentence = (nodes, sentence) => {
  const txt = sentence.trim()
  nodes.mainContent.innerHTML = txt
}

const displayText = (nodes, text) => {
  nodes.leftContent.innerHTML = text.reduce((acc, e, i) => {
    if (e[0] === '*') {
      const txt = e.substring(1).trim()
      return acc + `<ul><li>${txt}</li></ul>`
    }
    return acc + e + '<br>'
  }, '')
}

const plotSlide = (nodes, slideData) => {
  nodes.mainContent.innerHTML = ''
  nodes.leftContent.innerHTML = ''
  nodes.heading.innerHTML = ''
  nodes.imgRow1.hidden = true
  nodes.imgRow2.hidden = true
  nodes.imgWhole.hidden = true
  nodes.qrcanvas.hidden = true

  if (['boolean', 'number', 'string'].includes(typeof slideData))
    return displayStandaloneSentence(nodes, slideData.toString())

  if (Array.isArray(slideData))
    return displayText(nodes, slideData)

  return displayJSON(nodes, slideData)
}

export default plotSlide
