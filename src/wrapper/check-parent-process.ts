import { die } from './die.ts'
import { LogSink } from './types.ts'

export const ORPHAN_PPID = 1

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const makeCheckParentProcess = (_: LogSink) => {
  return async function checkParentProcess() {
    try {
      if (process.ppid === ORPHAN_PPID) {
        die('Parent process is the init process. Exiting...')
      } else {
        // log(`Parent process is alive. PPID:${process.ppid}`)
      }
    } catch (error) {
      die('Parent process died. Exiting...')
    }
  }
}
