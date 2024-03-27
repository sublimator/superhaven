import { EventSink, LogSink } from './types.cjs'

export function makeHandleInputData(LOG: LogSink, sendEvent: EventSink) {
  let inputBuffer: string = '' // Use a string to accumulate data
  // Function to log data to the file and also pass through the data
  return function handleInputData(
    data: Buffer,
    stream: NodeJS.WritableStream
  ): void {
    // Append the new data to the accumulated string
    inputBuffer += data.toString()
    // Just send this data directly to the child process
    stream.write(data)
    // Check if the accumulated data contains '\n'
    let newlineIndex: number
    while ((newlineIndex = inputBuffer.indexOf('\n')) !== -1) {
      // Extract the complete line up to and including the newline
      const line = inputBuffer.substring(0, newlineIndex + 1)
      // Log the line (without the newline character for clarity)
      LOG(`INPUT: ${line}`)
      // Post 'input' event with the trimmed line
      sendEvent('input', JSON.parse(line.trim()))
      // Remove the processed line from the buffer
      inputBuffer = inputBuffer.substring(newlineIndex + 1)
    }
  }
}
