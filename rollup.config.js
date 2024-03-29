// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript' // Import the plugin
import { execPath } from 'process'

export default {
  input: 'src/wrapper/sm-agent-wrapper.ts', // Your entry point
  output: {
    file: 'dist/sm-agent-wrapper.js', // Output file
    format: 'es', // Output format
    banner: `#!${execPath}` // Shebang for Node.js
  },
  external: ['fs', 'child_process', 'path', 'os', 'ws', 'http', 'https'],
  plugins: [
    nodeResolve({
      preferBuiltins: true,
      exportConditions: ['node']
    }),
    commonjs(),
    typescript({
      tsconfig: 'tsconfig.json'
    }) // Add the TypeScript plugin
  ]
}
