import { EventSink, LogSink } from './types.cjs'

export function makeOutputFactory(
  type: string,
  LOG: LogSink,
  sendEvent: EventSink
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
        const jsonStr: string = line.replace('SM-MESSAGE ', '')
        try {
          const jsonObj: object = JSON.parse(jsonStr)
          // Post 'output' event
          sendEvent('output', jsonObj)
        } catch (error) {
          LOG(`JSON parsing error: ${error}`)
        }
      }
    })
  }
}
