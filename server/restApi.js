const { resolve } = require('path')

function initRest(app) {
  app.get('/', (req, res) => {
    res.sendFile(resolve(`${__dirname}/../src/index.html`))
  })

  app.get('/:file', (req, res) => {
    const { file } = req.params
    const path = resolve(`${__dirname}/../src/${file}`)
    res.sendFile(path)
  })

  app.get('/:dir/:file', (req, res) => {
    const { file, dir } = req.params
    if (dir !== 'assets') {
      const path = resolve(`${__dirname}/../src/${dir}/${file}`)
      res.sendFile(path)
      return
    }
    const path = resolve(`${__dirname}/../assets/${file}`)
    res.sendFile(path)
  })
}

module.exports = initRest
