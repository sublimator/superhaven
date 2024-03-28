import { AgentContext, EventSink, LogSink } from './types.cjs'

export function makeHandleInputData(
  log: LogSink,
  sendEvent: EventSink,
  context: AgentContext
) {
  let inputBuffer = ''
  return function handleInputData(
    data: Buffer,
    stream: NodeJS.WritableStream
  ): void {
    inputBuffer += data.toString()
    let newlineIndex: number
    while ((newlineIndex = inputBuffer.indexOf('\n')) !== -1) {
      const line = inputBuffer.substring(0, newlineIndex + 1)
      log(`INPUT: ${line}`)
      if (context.isEnabled) {
        stream.write(data)
      }
      sendEvent('input', JSON.parse(line.trim()))
      inputBuffer = inputBuffer.substring(newlineIndex + 1)
    }
  }
}
