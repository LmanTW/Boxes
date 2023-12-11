const tsup = require('tsup')
const path = require('path')

tsup.build({
  entry: [path.resolve(__dirname, '../../BoxesEngine/API.js')],

  format: 'esm',
  minify: true,

  outDir: path.resolve(__dirname, '../../Assets/'),

  globalName: 'BoxesEngine'
})
