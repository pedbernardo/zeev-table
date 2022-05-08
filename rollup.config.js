import pkg from './package.json'

export default {
  input: './src/index.js',
  output: [
    {
      file: pkg.module,
      format: 'esm'
    },
    {
      name: 'TableMv',
      file: pkg.browser,
      format: 'umd'
    }
  ]
}
