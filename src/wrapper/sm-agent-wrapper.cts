#!/Users/nicholasdudfield/.nvm/versions/node/v20.8.1/bin/node
// TODO: use a generic shebang for node
import { initFromConfig } from './config.cjs'
import { makeCheckParentProcess } from './check-parent-process.cjs'
import { makeSocketServer } from './make-socket-server.cjs'
import { startAgent } from './start-agent.cjs'

const { authToken, binaryPath, logStream, log } = initFromConfig()
// This checks to see if the parent process (IntelliJ) has died and exits if it has
setInterval(makeCheckParentProcess(log), 2000)
log(`Started with: ${JSON.stringify(process.argv)}`)
const { sendEvent, httpServer } = makeSocketServer(authToken, log)
startAgent(binaryPath, logStream, log, sendEvent)
// Start the HTTP server on a specified port, for example, 8080
httpServer.listen(8080, () => {
  log('WebSocket server listening on port 8080')
})
