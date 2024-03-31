import {
  AgentContext,
  ClientMessage,
  DataType,
  EventData,
  EventType,
  InitCommand,
  LogSink,
  WebSocketMessageHandler
} from './types.ts'
import { WebSocket, WebSocketServer } from 'ws'
import { createServer } from 'http'
import { makePostHandler } from './make-post-handler.ts'
import { isRequestUnauthorized } from './is-request-unauthorized.ts'

export function makeSocketServer(
  log: LogSink,
  context: AgentContext,
  messageHandler: WebSocketMessageHandler
) {
  let eventId = 0 // Initialize event ID
  const buffer: string[] = []

  // HTTP POST function to send data to another app
  function sendEvent(type: EventType, data: DataType): void {
    const eventData: EventData = { id: eventId++, type, data }
    // Send it WebSocket subscribers!
    try {
      const serialized = JSON.stringify(eventData)
      if (wss.clients.size > 0) {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            for (const line of buffer) {
              client.send(line)
            }
            client.send(serialized)
          }
        })
        while (buffer.length > 0) {
          buffer.pop()
        }
      } else {
        buffer.push(serialized)
      }
    } catch (e) {
      log('error writing to websockets!')
    }
  }

  const postHandler = makePostHandler(messageHandler, log, context)
  const httpServer = createServer(postHandler)
  const wss = new WebSocketServer({ noServer: true })

  httpServer.on('upgrade', function (request, socket, head) {
    log(`Upgrade request: ${request.url}`)
    const unAuthorized = isRequestUnauthorized(request, context)
    if (unAuthorized) {
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n')
      socket.destroy()
      return
    }

    wss.handleUpgrade(request, socket, head, function done(ws) {
      log('WebSocket upgrade done')
      wss.emit('connection', ws, request)
      const msg: InitCommand = { kind: 'init', data: context }
      ws.send(JSON.stringify(msg))
      ws.on('message', rawWsMessage => {
        try {
          const messageData = JSON.parse(
            rawWsMessage.toString()
          ) as ClientMessage
          messageHandler(messageData, (message: object) => {
            ws.send(JSON.stringify({ id: messageData.id, ...message }))
          })
        } catch (e) {
          log(`Error parsing message: ${e}`)
        }
      })
    })
  })
  return { sendEvent, httpServer }
}
