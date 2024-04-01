import { initContextFromConfig } from './config.ts'
import { makeCheckParentProcess } from './check-parent-process.ts'
import { makeSocketServer } from './make-socket-server.ts'
import { startAgent } from './start-agent.ts'
import { ChildProcessWithoutNullStreams } from 'child_process'
import { nonNullable } from '../utils/non-nullable.ts'

const { binaryPath, log, config, context } = initContextFromConfig()

// This checks to see if the parent process (IntelliJ) has died and exits if it has
setInterval(makeCheckParentProcess(log), 2000)

log(`Started with: ${JSON.stringify(process.argv)} in ${process.cwd()}`)
let childStdin: ChildProcessWithoutNullStreams['stdin'] | null = null

const { sendEvent, httpServer } = makeSocketServer(
  log,
  context,
  (data, send) => {
    log(`Received message: ${JSON.stringify(data)}`)
    if (data.kind === 'die') {
      // e.g. curl -X POST -H "Content-Type: application/json" -d '{"kind":"die"}' http://localhost:8080
      process.exit(data.code ?? 0)
    }
    if (data.kind === 'set-enabled') {
      context.isEnabled = data.enabled
    }
    if (data.kind === 'set-allow-gitignore') {
      const stream = nonNullable(childStdin, 'childStdin not set')
      stream.write(
        JSON.stringify({
          kind: 'greeting',
          allowGitignore: data.allowGitignore
        }) + '\n'
      )
      send({ success: true })
    }
  }
)

const { childInput } = startAgent(
  binaryPath,
  log,
  sendEvent,
  context,
  config.startMessages ?? [],
  jsonObj => {
    if (jsonObj.kind === 'passthrough') {
      const passthrough = jsonObj.passthrough
      if (passthrough.kind === 'active_repo') {
        log(`setting context.activeRepo to ${passthrough.repo_simple_name}`)
        context.activeRepo = passthrough.repo_simple_name
      }
    }
    sendEvent('output', jsonObj)
  }
)

childStdin = childInput

httpServer.listen(config.port, () => {
  log(`WebSocket server listening on port ${config.port}`)
})
