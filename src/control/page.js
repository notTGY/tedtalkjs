import paint from '../lib/paint.js'

export function render(data, n) {
  const main = document.querySelector('main')
  const now = main.innerHTML
  if (!now) {
    const slideData = data.reduce((prev, cur, i) => {
      return prev + `
      <div class="slide">
        <h2 id="h${i}">${i + 1}</h2>
        <textarea id="t${i}"></textarea>
      </div>`
    }, '')

    main.innerHTML = `
  <section id="slides">
  ${slideData}
  <div><button id="plus">+</button></div>
  </section>
  <section id="pres"></section>

  <style>
    html, body, main { width: 100%; height: 100%; margin: 0; }
    #slides { width: 100%; height: 50%; display: flex; overflow: auto; }
    .slide { display: flex; align-items: center; justify-content: center; flex-direction: column; flex: none; }
    .slide textarea { width: 200px; height: calc(100% - 2rem); resize: horizontal }
    .slide h2 { height: 2rem; line-height: 2rem; font-size: 1.3rem; padding: 0; margin: 0; }
    .selected  { color: red; }

    #plus { margin: 1rem; }

    #pres { width: 100%; height: 50%; display: flex; justify-content: center; }
  </style>
  `
  }


  const pres = document.getElementById('pres')
  pres.innerHTML = paint(data[n])

  data.forEach((item, i) => {
    const textarea = document.getElementById('t'+i)
    const h = document.getElementById('h'+i)
    if (i === n) {
      h.classList.add('selected')
    } else {
      h.classList.remove('selected')
    }
    textarea.innerHTML = item
  })

}

export function add(i, textareaCb) {
  const plus = document.getElementById('plus')
  const div = document.createElement('div')
  div.classList.add('slide')
  div.innerHTML = `
    <h2 id="h${i}">${i + 1}</h2>
    <textarea id="t${i}"></textarea>
  `
  plus.parentElement.before(div)

  const textarea = document.getElementById('t'+i)
  textareaCb(textarea, i)
  textarea.focus()
}
