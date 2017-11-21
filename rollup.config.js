import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/Inrtia.js',
  name: 'Inrtia',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ],
  output: [
    { file: 'bin/inrtia.browser.js', format: 'umd' },
    { file: 'bin/inrtia.module.js', format: 'es' },
    { file: 'bin/inrtia.js', format: 'cjs' }
  ]
};
