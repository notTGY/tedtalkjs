const TYPES_TO_CSS = {
  '-': 'row',
  '|': 'col',
  '*': 'whole',
  '\\': 'diag',
  '/': 'revdiag',
}

const displayJSON = (slide, json, images) => {
  let template = ''
  if ('author' in json && 'h' in json)
    template += `
      <section class="center main-content">
        ${json.author}
        <hr>
        <big><big>${json.h}</big></big>
      </section>
      `

  if ('text' in json)
    template += `
      <h1 class="heading">
        ${json.text}
      </h1>
    `

  let type = TYPES_TO_CSS[json.mode ?? '-']
  if ('img' in json && 'img2' in json)
    template += ['diag', 'revdiag'].includes(type)
    ? `
      <div class="center">
        <div class="img-${type}">
          <img
            src="${images[json.img]}"
          />
          <img
            src="${images[json.img2]}"
          />
        </div>
      </div>
    `
    : `
      <div class="center img-${type}">
        <img
          src="${images[json.img]}"
        />
        <img
          src="${images[json.img2]}"
        />
      </div>
    `

  type = TYPES_TO_CSS[json.mode ?? '*']
  if ('img' in json && !('img2' in json))
    template += ['diag', 'revdiag'].includes(type)
    ? `
      <div class="center">
        <div class="img-${type}">
          <img
            src="${images[json.img]}"
          />
        </div>
      </div>
    `
    : `
      <div class="center img-${type}">
        <img
          src="${images[json.img]}"
        />
      </div>
    `

  slide.innerHTML = template
}

export default displayJSON
