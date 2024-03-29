// noinspection DuplicatedCode

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readSuperHavenConfig } from './src/wrapper/config/read-super-haven-config'

const config = readSuperHavenConfig()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.SUPER_HAVEN_AUTH_TOKEN': JSON.stringify(config.authToken)
  }
})
