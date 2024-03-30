import { execSync } from 'node:child_process'

export function getAgentVersion(binaryPath: string) {
  return parseInt(execSync(`${binaryPath} version`).toString())
}
