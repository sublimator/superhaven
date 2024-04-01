import fs from 'node:fs'

import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import chalk from 'chalk'

import { readSuperHavenConfig } from './config/read-super-haven-config.ts'
import { expandTildeInPaths } from './expand-tilde-in-paths.ts'
import { expandTilde } from './config/expand-tilde.ts'

const configPathHuman = '~/.supermaven/superhaven.config.json'
const rootDir = fileURLToPath(new URL('../..', import.meta.url)).slice(0, -1)
const wrapperBuildPath = `${rootDir}/dist/sm-agent-wrapper.js`

const header = chalk.yellow('[sh]')
const log = console.log.bind(console, header)
const die = (message: string) => {
  console.error(header, message)
  process.exit(1)
}

if (process.platform === 'win32') {
  die('Windows is not supported yet, sorry!')
}

log('Using superhaven checkout:', rootDir)

if (!fs.existsSync(expandTilde(configPathHuman))) {
  die(`No ${configPathHuman} found (auto init TBD)`)
}

const rawConfig = readSuperHavenConfig(die)
const config = expandTildeInPaths(rawConfig)
const smAgentPath = `${config.binaryDirectory}/sm-agent`
const smAgentRealPath = `${config.binaryDirectory}/sm-agent-real`
const G = (s: string) =>
  new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
const withVars = (s: string) =>
  s
    .replace(G(config.binaryDirectory), '$binaryDirectory')
    .replace(G(rootDir), '$rootDir')

const cmd = (cmd: string, cwd?: string) => {
  log('executing:', withVars(cmd), cwd ? `(cwd: ${withVars(cwd)})` : '')
  execSync(cmd, { stdio: 'ignore', cwd })
}

log('Using config:', JSON.stringify(rawConfig, null, 2))
if (!fs.existsSync(config.binaryDirectory)) {
  die(`Binary directory ${config.binaryDirectory} not found`)
}
if (fs.existsSync(`${config.binaryDirectory}/sm-agent-real`)) {
  log('sm-agent-real already exists in binary directory, restoring')
  cmd(`mv "${smAgentRealPath}" "${smAgentPath}"`)
}

cmd('pnpm build:wrapper')
cmd(`chmod +x "${wrapperBuildPath}"`)
cmd(`mv "${smAgentPath}" "${smAgentRealPath}"`)
cmd(`ln -s "${wrapperBuildPath}" sm-agent`, config.binaryDirectory)
