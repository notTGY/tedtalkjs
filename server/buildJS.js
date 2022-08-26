const {build} = require('esbuild')

build({
  entryPoints: ['src/new/index.js'],
  bundle: true,
  minify: true,
  outfile: 'server/cache.js',
  logLevel: 'info',
  loader: { ".js": "jsx" },
  tsconfig: 'server/tsconfig.json',
  watch: true
})
