// Define types for the event data
export type EventType = 'input' | 'output'
export type DataType = unknown

export interface EventData {
  id: number // auto incrementing id
  type: EventType
  data: DataType
}

export type LogSink = (data: string) => void
export type EventSink = (type: EventType, data: DataType) => void

export interface Command<T = any> {
  kind: string
  data?: T
}

export interface DieCommand extends Command {
  kind: 'die'
  code?: number
}
export interface SetEnabledCommand extends Command {
  kind: 'set-enabled'
  enabled: boolean
}

export type WebSocketMessage = DieCommand | SetEnabledCommand

export interface WebSocketMessageHandler {
  (data: WebSocketMessage): void
}

export interface AgentContext {
  isEnabled: boolean
}
