import { LogSink } from './types.ts'

import { AgentOutMessage } from '../types/messages/agent-out-messages.ts'

const SM_MESSAGE = 'SM-MESSAGE'

export function makeOutputFactory(
  type: string,
  log: LogSink,
  onOutMessage: (message: AgentOutMessage) => void
) {
  // Buffer for stdout to handle data until newline
  let stdoutBuffer: string = ''
  return function onData(data: Buffer) {
    stdoutBuffer += data.toString()
    const lines: string[] = stdoutBuffer.split('\n')
    stdoutBuffer = lines.pop() || '' // Keep the last partial line in buffer

    lines.forEach((line: string) => {
      log(`${type}: ${line}`)
      if (line.startsWith(SM_MESSAGE)) {
        const jsonStr = line.slice(SM_MESSAGE.length)
        try {
          const jsonObj = JSON.parse(jsonStr)
          try {
            onOutMessage(jsonObj)
          } catch (e) {
            log(`Error sending out message: ${e}`)
          }
        } catch (error) {
          log(`JSON parsing error: ${error}`)
        }
      }
    })
  }
}
