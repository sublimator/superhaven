#!/Users/nicholasdudfield/.nvm/versions/node/v20.8.1/bin/node
// TODO: use a generic shebang for node
import { initFromConfig } from './config.cjs'
import { makeCheckParentProcess } from './check-parent-process.cjs'
import { makeSocketServer } from './make-socket-server.cjs'
import { startAgent } from './start-agent.cjs'
import { AgentContext } from './types.cjs'

const context: AgentContext = {
  isEnabled: true
}

const { authToken, binaryPath, logStream, log } = initFromConfig()
// This checks to see if the parent process (IntelliJ) has died and exits if it has
setInterval(makeCheckParentProcess(log), 2000)
log(`Started with: ${JSON.stringify(process.argv)}`)
const { sendEvent, httpServer } = makeSocketServer(authToken, log, data => {
  if (data.kind === 'die') {
    process.exit(data.code ?? 0)
  }
  if (data.kind === 'set-enabled') {
    context.isEnabled = data.enabled
  }
})

startAgent(binaryPath, logStream, log, sendEvent, context)
// Start the HTTP server on a specified port, for example, 8080
httpServer.listen(8080, () => {
  log('WebSocket server listening on port 8080')
})
