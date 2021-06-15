import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import { eslint } from 'rollup-plugin-eslint'
import { terser } from 'rollup-plugin-terser'
import glslify from 'rollup-plugin-glslify'

const extensions = ['.js', '.ts']

const commonPlugins = () => [
  resolve({ extensions }),
  eslint({
    include: 'src/*'
  }),
  babel({ extensions, include: ['src/**/*'] }),
  glslify({
    basedir: 'src/shaders',
    exclude: 'node_modules/**'
  })
]

const makeOutput = (name, format) => ({
  file: name,
  format: format,
  name: 'CryptoGawd',
  exports: 'named',
  sourcemap: true,
  globals: { 
    three: 'THREE',
    'three-spatial-viewer': 'SpatialViewer',
    http: 'http'
  }
})

const config = [
  {
    input: 'src/index.ts',
    output: [
      makeOutput(`dist/gawd-player.js`, 'umd'),
      makeOutput(`dist/gawd-player.amd.js`, 'amd'),
      makeOutput(`dist/gawd-player.esm.js`, 'esm')
    ],
    external: ['three', 'three-spatial-viewer', 'http'],
    plugins: commonPlugins()
  },
  {
    input: 'src/index.ts',
    output: [
      makeOutput(`dist/gawd-player.min.js`, 'umd'),
      makeOutput(`dist/gawd-player.amd.min.js`, 'amd'),
      makeOutput(`dist/gawd-player.esm.min.js`, 'esm')
    ],
    external: ['three', 'three-spatial-viewer', 'http'],
    plugins: [
      ...commonPlugins(),
      terser()
    ]
  }
]

module.exports = config