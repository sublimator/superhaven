// TODO: use a generic shebang for node
import { initFromConfig } from './config.ts'
import { makeCheckParentProcess } from './check-parent-process.ts'
import { makeSocketServer } from './make-socket-server.ts'
import { startAgent } from './start-agent.ts'
import { AgentContext } from './types.ts'

const { authToken, version, binaryPath, log, config } = initFromConfig()
const context: AgentContext = {
  isEnabled: true,
  activeRepo: null,
  binaryVersion: version,
  config
}

// This checks to see if the parent process (IntelliJ) has died and exits if it has
setInterval(makeCheckParentProcess(log), 2000)
log(`Started with: ${JSON.stringify(process.argv)} in ${process.cwd()}`)
const { sendEvent, httpServer } = makeSocketServer(
  authToken,
  log,
  context,
  data => {
    log(`Received message: ${JSON.stringify(data)}`)
    if (data.kind === 'die') {
      process.exit(data.code ?? 0)
    }
    if (data.kind === 'set-enabled') {
      context.isEnabled = data.enabled
    }
  }
)

startAgent(binaryPath, log, sendEvent, context, jsonObj => {
  if (jsonObj.kind === 'passthrough') {
    const passthrough = jsonObj.passthrough
    if (passthrough.kind === 'active_repo') {
      log(`setting context.activeRepo to ${passthrough.repo_simple_name}`)
      context.activeRepo = passthrough.repo_simple_name
    }
  }
  sendEvent('output', jsonObj)
})

// Start the HTTP server on a specified port, for example, 8080
httpServer.listen(8080, () => {
  log('WebSocket server listening on port 8080')
})
