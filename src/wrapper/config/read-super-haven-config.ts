// noinspection DuplicatedCode

import { expandTilde } from './expand-tilde.ts'
import path from 'node:path'
import fs from 'node:fs'
import { die } from '../die.ts'
import { DieFunc, SuperHavenConfig } from '../types.ts'

export function readSuperHavenConfig(doDie: DieFunc = die): SuperHavenConfig {
  const superMavenHome = expandTilde('~/.supermaven')
  const configPath = path.join(superMavenHome, 'superhaven.config.json')
  if (!fs.existsSync(configPath)) {
    const message = `superhaven.config.json not found at ${configPath}`
    doDie(message)
  }
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'))
  } catch (e) {
    doDie(`Error reading superhaven.config.json: ${e}`)
  }
}
