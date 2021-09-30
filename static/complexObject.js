const displayJSON = (nodes, json) => {
  if ('author' in json && 'h' in json) {
    nodes.mainContent.innerHTML = 
      json.author + '<hr>' + `<big><big>${json.h}</big></big>`
    return
  }
  if ('h' in json)
    nodes.heading.innerHTML = `<big><big>${json.h}</big></big>`

  if ('img' in json && 'img2' in json) {
    const mode = json.mode ?? 'row'

    switch (mode) {
      case 'row':
        nodes.imgRow1.src = json.img
        nodes.imgRow2.src = json.img2
        nodes.imgRow1.hidden = false
        nodes.imgRow2.hidden = false
        break
    }
    return
  }
  if ('img' in json) {
    const mode = json.mode ?? 'whole'

    switch (mode) {
      case 'whole':
        nodes.imgWhole.src = json.img
        nodes.imgWhole.hidden = false
        break
    }
    return
  }

  nodes.mainContent.innerText = JSON.stringify(json)
}

export default displayJSON
