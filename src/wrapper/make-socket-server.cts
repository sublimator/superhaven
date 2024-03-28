import {
  DataType,
  EventData,
  EventType,
  LogSink,
  WebSocketMessageHandler
} from './types.cjs'
import { WebSocket, WebSocketServer } from 'ws'
import { createServer } from 'http'

export function makeSocketServer(
  authToken: string,
  log: LogSink,
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

  const httpServer = createServer()
  const wss = new WebSocketServer({ noServer: true })

  httpServer.on('upgrade', function (request, socket, head) {
    log(`Upgrade request: ${request.url}`)

    const url = new URL(request.url!, 'http://localhost:8080')
    const token = url.searchParams.get('token')
    const noAuthHeader =
      !request.headers.authorization ||
      request.headers.authorization !== `Bearer ${authToken}`
    if (noAuthHeader && token !== authToken) {
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n')
      socket.destroy()
      return
    }

    wss.handleUpgrade(request, socket, head, function done(ws) {
      log('WebSocket upgrade done')
      wss.emit('connection', ws, request)
      ws.on('message', function incoming(message) {
        try {
          const messageData = JSON.parse(message.toString())
          messageHandler(messageData)
        } catch (e) {
          log(`Error parsing message: ${e}`)
        }
      })
    })
  })
  return { sendEvent, httpServer }
}
