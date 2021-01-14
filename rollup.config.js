import { babel } from '@rollup/plugin-babel';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  external: Object.keys(pkg.dependencies).concat(
    Object.keys(pkg.peerDependencies),
  ),
  output: [
    { file: pkg.browser, format: 'es' },
  ],
  plugins: [
    babel({
      babelrc: false,
      presets: [
        ['@babel/preset-env', { modules: false }],
        '@babel/preset-flow',
        '@babel/preset-react',
      ],
      plugins: [
        '@babel/plugin-external-helpers',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-object-rest-spread',
      ],
      babelHelpers: 'runtime',
    }),
  ],
};
