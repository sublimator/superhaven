// noinspection DuplicatedCode

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'

interface SuperHavenConfig {
  workingDirectory: string
  authToken: string
}

export function die(message: string): never {
  console.error(message)
  process.exit(1)
}

export function expandTilde(filePath: string): string {
  if (filePath.startsWith('~')) {
    return path.join(os.homedir(), filePath.slice(1))
  }
  return filePath
}

export function readSuperHavenConfig(): SuperHavenConfig {
  const superMavenHome = expandTilde('~/.supermaven')
  const configPath = path.join(superMavenHome, 'superhaven.config.json')
  if (!fs.existsSync(configPath)) {
    const message = `superhaven.config.json not found at ${configPath}`
    die(message)
  }
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'))
  } catch (e) {
    die(`Error reading superhaven.config.json: ${e}`)
  }
}

const config = readSuperHavenConfig()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.SUPER_HAVEN_AUTH_TOKEN': JSON.stringify(config.authToken)
  }
})
