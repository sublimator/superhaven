import path from 'node:path'
import os from 'node:os'

export function expandTilde(filePath: string): string {
  if (filePath.startsWith('~')) {
    return path.join(os.homedir(), filePath.slice(1))
  }
  return filePath
}
