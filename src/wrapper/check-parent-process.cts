import { die } from './die.cjs'
import { LogSink } from './types.cjs'

export const ORPHAN_PPID = 1

export const makeCheckParentProcess = (log: LogSink) => {
  return async function checkParentProcess() {
    try {
      if (process.ppid === ORPHAN_PPID) {
        die('Parent process is the init process. Exiting...')
      } else {
        log(`Parent process is alive. PPID:${process.ppid}`)
      }
    } catch (error) {
      die('Parent process died. Exiting...')
    }
  }
}
