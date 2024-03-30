import fs from 'node:fs'
import { join } from 'path'
import { createWriteStream } from 'fs'
import { die } from './die.ts'
import { readSuperHavenConfig } from './config/read-super-haven-config.ts'
import { SuperHavenConfig } from './types.ts'
import { expandTildeInPaths } from './expand-tilde-in-paths.ts'
import { getAgentVersion } from './get-agent-version.ts'

function createLog(config: SuperHavenConfig) {
  let logStream: fs.WriteStream | null = null
  if (config.logFile) {
    logStream = createWriteStream(config.logFile, { flags: 'a' })
    process.once('exit', () => {
      logStream?.close()
    })
  }
  return (data: string) => {
    if (logStream === null) {
      return
    }
    const redacted = data.replace(config.authToken, '<auth-token>')
    logStream.write(redacted + '\n')
  }
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
  const version = getAgentVersion(binaryPath)
  const log = createLog(config)
  return { authToken: config.authToken, binaryPath, log, config, version }
}
