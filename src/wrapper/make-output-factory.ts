import { LogSink } from './types.ts'
import { AgentOutMessage } from '../types/messages.ts'

export function makeOutputFactory(
  type: string,
  LOG: LogSink,
  onOutMessage: (message: AgentOutMessage) => void
) {
  // Buffer for stdout to handle data until newline
  let stdoutBuffer: string = ''
  return function onData(data: Buffer) {
    stdoutBuffer += data.toString()
    const lines: string[] = stdoutBuffer.split('\n')
    stdoutBuffer = lines.pop() || '' // Keep the last partial line in buffer

    lines.forEach((line: string) => {
      LOG(`${type}: ${line}`)
      if (line.startsWith('SM-MESSAGE')) {
        const jsonStr = line.replace('SM-MESSAGE ', '')
        try {
          const jsonObj = JSON.parse(jsonStr)
          try {
            onOutMessage(jsonObj)
          } catch (e) {
            LOG(`Error sending out message: ${e}`)
          }
        } catch (error) {
          LOG(`JSON parsing error: ${error}`)
        }
      }
    })
  }
}
