import fs from 'node:fs'
import { join } from 'path'
import { createWriteStream } from 'fs'
import { die } from './die.ts'
import { readSuperHavenConfig } from './config/read-super-haven-config.ts'
import {
  AgentContext,
  ParsedAndDefaultedConfig,
  SuperHavenConfig
} from './types.ts'
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

export function initContextFromConfig() {
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
  const binaryVersion = getAgentVersion(binaryPath)
  const log = createLog(config)

  const defaultedConfig: ParsedAndDefaultedConfig = {
    ...config,
    port: config.port ?? 8080
  }

  const context: AgentContext = {
    isEnabled: true,
    activeRepo: null,
    binaryVersion,
    env: {
      // All SM_ prefixed env vars are passed through to the agent
      ...Object.keys(process.env).reduce(
        (acc, key) => {
          if (key.startsWith('SM')) {
            acc[key] = process.env[key]!
          }
          return acc
        },
        {} as Record<string, string>
      ),
      SM_EDITOR: process.env.SM_EDITOR,
      SM_EDITOR_VERSION: process.env.SM_EDITOR_VERSION,
      SM_EXTENSION_VERSION: process.env.SM_EXTENSION_VERSION,
      SM_LOG_PATH: process.env.SM_LOG_PATH
    },
    config: defaultedConfig
  }

  return { binaryPath, log, config: defaultedConfig, context }
}
