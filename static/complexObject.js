const displayJSON = (json) => {
  if ('author' in json && 'h' in json) {
    mainContent.innerHTML = 
      json.author + '<hr>' + `<big><big>${json.h}</big></big>`
    return
  }
  if ('h' in json)
    heading.innerHTML = `<big><big>${json.h}</big></big>`

  if ('img' in json && 'img2' in json) {
    const mode = json.mode ?? 'row'

    switch (mode) {
      case 'row':
        imgRow1.src = json.img
        imgRow2.src = json.img2
        imgRow1.hidden = false
        imgRow2.hidden = false
        break
    }
    return
  }
  if ('img' in json) {
    const mode = json.mode ?? 'whole'

    switch (mode) {
      case 'whole':
        imgWhole.src = json.img
        imgWhole.hidden = false
        break
    }
    return
  }

  mainContent.innerText = JSON.stringify(json)
}
