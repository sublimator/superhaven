import { AgentContext, EventSink, LogSink } from './types.ts'
import { makeHandleInputData } from './handle-input-data.ts'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { makeOutputFactory } from './make-output-factory.ts'

import { AgentOutMessage } from '../types/messages/agent-out-messages.ts'
import { EditorOutMessage } from '../types/messages/editor-out-messages.ts'

export function startAgent(
  binaryPath: string,
  log: LogSink,
  sendEvent: EventSink,
  context: AgentContext,
  startMessages: EditorOutMessage[],
  onOutMessage: (message: AgentOutMessage) => void
) {
  const handleInputData = makeHandleInputData(log, sendEvent, context)
  // Capture the original process's argv, removing the first two entries (`node` and script path)
  const args: string[] = process.argv.slice(2)
  // Spawn the child process with the provided arguments
  const childProcess: ChildProcessWithoutNullStreams = spawn(binaryPath, args, {
    stdio: ['pipe', 'pipe', 'pipe']
  })

  const onStdOut = makeOutputFactory('STDOUT', log, onOutMessage)
  const onStdErr = makeOutputFactory('STDERR', log, onOutMessage)

  childProcess.stdout.on('data', (data: Buffer) => {
    process.stdout.write(data)
    onStdOut(data)
  })

  childProcess.stderr.on('data', (data: Buffer) => {
    process.stderr.write(data)
    onStdErr(data)
  })

  process.stdin.on('data', (data: Buffer) =>
    handleInputData(data, childProcess.stdin)
  )

  childProcess.on('exit', (code: number | null) => {
    log(`Process exited with code: ${code}`)
    process.exit(code ?? 0)
  })

  childProcess.on('error', (err: Error) => {
    console.error(`Failed to start subprocess: ${err}`)
    log(`Failed to start subprocess: ${err}`)
  })

  startMessages.forEach(message => {
    childProcess.stdin.write(JSON.stringify(message) + '\n')
  })

  return { childInput: childProcess.stdin }
}
