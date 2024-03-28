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
  id?: number
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

export interface InitCommand extends Command {
  kind: 'init'
  data: AgentContext
}

export type ClientMessage = DieCommand | SetEnabledCommand
export type ServerMessage = InitCommand

export interface WebSocketMessageHandler {
  (data: ClientMessage): void
}

export interface AgentContext {
  isEnabled: boolean
}
