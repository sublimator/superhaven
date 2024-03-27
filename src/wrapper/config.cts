import fs from 'node:fs'
import { join } from 'path'
import { createWriteStream } from 'fs'
import { die } from './die.cjs'
import { readSuperHavenConfig } from './config/read-super-haven-config.cjs'

export function initFromConfig() {
  const config = readSuperHavenConfig()
  if (!config.authToken) {
    die('No auth token found in superhaven.config.json')
  }
  if (!fs.existsSync(config.workingDirectory)) {
    die(`Working directory ${config.workingDirectory} not found`)
  }
  const binaryPath = join(config.workingDirectory, 'sm-agent-real')
  if (!fs.existsSync(binaryPath)) {
    die(`sm-agent-real not found at ${binaryPath}`)
  }
  const logStream = createWriteStream(
    join(config.workingDirectory, 'sm-agent-io.log'),
    { flags: 'a' }
  )
  const log = (data: string) => {
    logStream.write(data + '\n')
  }
  return { authToken: config.authToken, binaryPath, logStream, log }
}
