import { LogSink, WebSocketMessageHandler } from './types.ts'
import { IncomingMessage, ServerResponse } from 'node:http'

export function makePostHandler(
  messageHandler: WebSocketMessageHandler,
  log: LogSink
) {
  return (req: IncomingMessage, res: ServerResponse) => {
    // Handle HTTP POST requests
    if (
      req.method === 'POST' &&
      req.headers['content-type'] === 'application/json'
    ) {
      let body = ''
      req.on('data', chunk => {
        body += chunk.toString() // Convert Buffer to string
      })
      req.on('end', () => {
        try {
          const data = JSON.parse(body)
          log(`Received POST request: ${JSON.stringify(data)}`)
          // Use the same messageHandler as for WebSocket messages
          messageHandler(data, message => {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ id: data.id, ...message }))
          })
        } catch (e) {
          log(`Error parsing JSON: ${e}`)
          res.statusCode = 400
          res.end('Invalid JSON')
        }
      })
    } else {
      // Handle other HTTP methods or content types
      res.writeHead(405)
      res.end('Method Not Allowed')
    }
  }
}
