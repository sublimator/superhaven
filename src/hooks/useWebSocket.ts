import { useCallback, useEffect, useRef, useState } from 'react'

interface UseWebSocketParams<Buffered, Command> {
  url: string
  token: string
  keepUpTo?: number
  processMessage?: (message: string) => unknown
  onMessage?: (message: Buffered) => void
  onCommand?: (command: Command) => void
  isMessageBuffered: (message: Buffered | Command) => boolean
  onClose?: () => void
  reconnect?: boolean
  add?: 'front'
}

const log = console.log.bind(console, '[useWebSocket]')

export function useWebSocket<Buffered = string, Command = string>({
  url,
  token,
  processMessage,
  isMessageBuffered,
  onMessage,
  onCommand,
  onClose,
  reconnect = true,
  keepUpTo = 500
}: UseWebSocketParams<Buffered, Command>) {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<Buffered[]>([])
  const [totalMessages, setTotalMessages] = useState(0)
  const ws = useRef<WebSocket | null>(null)

  // Function to send messages through the WebSocket connection
  const sendMessage = useCallback((message: unknown) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
    }
  }, [])

  function setHandlers(current: WebSocket) {
    current.onopen = () => {
      setConnected(true)
      log('WebSocket connected')
    }
    current.onclose = () => {
      onClose?.()
      setMessages([])
      setTotalMessages(0)
      if (ws.current !== current) {
        // TODO: not entirely sure why this is necessary
        log('WebSocket connection lost onclose', ws.current)
        return
      }
      setConnected(false)
      if (reconnect) {
        setTimeout(connect, 1000)
      }
      log('WebSocket disconnected')
    }
    current.onerror = error => {
      console.error('WebSocket error:', error)
    }
    current.onmessage = event => {
      const parse = processMessage ? processMessage(event.data) : event.data
      if (parse) {
        if (isMessageBuffered(parse)) {
          setTotalMessages(prev => prev + 1)
          setMessages(prevMessages => {
            return [parse, ...prevMessages.slice(0, keepUpTo - 1)]
          })
          onMessage?.(parse)
        } else {
          onCommand?.(parse)
        }
      }
    }
  }

  function connect() {
    log('Connecting to websocket')
    const wsUrl = new URL(url)
    wsUrl.searchParams.append('token', token)
    ws.current = new WebSocket(wsUrl.toString())
    setHandlers(ws.current)
  }

  useEffect(() => {
    // Append the token to the URL query parameters
    connect()

    // Cleanup function to close the WebSocket connection when the component unmounts
    return () => {
      ws.current?.close()
      ws.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, token, reconnect])

  return { totalMessages, connected, ws: ws.current, messages, sendMessage }
}
