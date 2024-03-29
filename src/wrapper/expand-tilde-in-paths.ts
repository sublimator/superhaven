import { SuperHavenConfig } from './types.ts'
import { expandTilde } from './config/expand-tilde.ts'

export function expandTildeInPaths(config: SuperHavenConfig) {
  const c = JSON.parse(JSON.stringify(config)) as SuperHavenConfig
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
