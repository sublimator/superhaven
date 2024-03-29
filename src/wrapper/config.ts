import fs from 'node:fs'
import { join } from 'path'
import { createWriteStream } from 'fs'
import { die } from './die.ts'
import { readSuperHavenConfig } from './config/read-super-haven-config.ts'
import { SuperHavenConfig } from './types.ts'
import { expandTilde } from './config/expand-tilde.ts'

function createLog(config: SuperHavenConfig) {
  let logStream: fs.WriteStream | null = null
  if (config.logFile) {
    logStream = createWriteStream(config.logFile, { flags: 'a' })
    process.once('exit', () => {
      logStream?.close()
    })
  }
  return (data: string) => {
    const redacted = data.replace(config.authToken, '<auth-token>')
    logStream?.write(redacted + '\n')
  }
}

function expandTildeInPaths(c: SuperHavenConfig) {
  c.binaryDirectory = expandTilde(c.binaryDirectory)
  if (c.logFile) {
    c.logFile = expandTilde(c.logFile)
  }
  c.projects = Object.fromEntries(
    Object.entries(c.projects).map(([k, v]) => {
      v.root = expandTilde(v.root)
      return [k, v]
    })
  )
  return c
}

export function initFromConfig() {
  const config = expandTildeInPaths(readSuperHavenConfig())
  if (!config.authToken) {
    die('No auth token found in superhaven.config.json')
  }
  if (!fs.existsSync(config.binaryDirectory)) {
    die(`Binary directory ${config.binaryDirectory} not found`)
  }
  const binaryPath = join(config.binaryDirectory, 'sm-agent-real')
  if (!fs.existsSync(binaryPath)) {
    die(`sm-agent-real not found at ${binaryPath}`)
  }

  const log = createLog(config)
  return { authToken: config.authToken, binaryPath, log, config }
}
