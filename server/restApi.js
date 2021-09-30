const { resolve } = require('path')

function initRest(app) {
  app.get('/', (req, res) => {
    res.sendFile(resolve(`${__dirname}/../static/index.html`))
  })

  app.get('/:file', (req, res) => {
    const { file } = req.params
    const path = resolve(`${__dirname}/../static/${file}`)
    res.sendFile(path)
  })

  app.get('/assets/:file', (req, res) => {
    const { file } = req.params
    const path = resolve(`${__dirname}/../assets/${file}`)
    res.sendFile(path)
  })
}

module.exports = initRest
