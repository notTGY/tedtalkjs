const displayJSON = (json) => {
  if ('author' in json && 'h' in json) {
    mainContent.innerHTML = 
      json.author + '<hr>' + `<big><big>${json.h}</big></big>`
    return
  }
  mainContent.innerText = JSON.stringify(json)
}
