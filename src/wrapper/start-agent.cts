import fs from 'node:fs'
import { EventSink, LogSink } from './types.cjs'
import { makeHandleInputData } from './handle-input-data.cjs'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { makeOutputFactory } from './make-output-factory.cjs'

export function startAgent(
  binaryPath: string,
  logStream: fs.WriteStream,
  log: LogSink,
  sendEvent: EventSink
) {
  const handleInputData = makeHandleInputData(log, sendEvent)
  // Capture the original process's argv, removing the first two entries (`node` and script path)
  const args: string[] = process.argv.slice(2)
  // Spawn the child process with the provided arguments
  const childProcess: ChildProcessWithoutNullStreams = spawn(binaryPath, args, {
    stdio: ['pipe', 'pipe', 'pipe']
  })

  const onStdOut = makeOutputFactory('STDOUT', log, sendEvent)
  const onStdErr = makeOutputFactory('STDERR', log, sendEvent)

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
    logStream.close()
    process.exit(code ?? 0)
  })

  childProcess.on('error', (err: Error) => {
    console.error(`Failed to start subprocess: ${err}`)
    log(`Failed to start subprocess: ${err}`)
    logStream.close()
  })
}
