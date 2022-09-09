const {build} = require('esbuild')

build({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: false,
  outfile: 'server/cache.js',
  logLevel: 'info',
  loader: { ".js": "jsx" },
  tsconfig: 'server/tsconfig.json',
  watch: true
})
