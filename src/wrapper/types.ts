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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  (data: ClientMessage, sendMessage: (message: object) => void): void
}

interface ParsedAndDefaultedContext extends SuperHavenConfig {
  port: number
}

export interface AgentContext {
  isEnabled: boolean
  binaryVersion: number
  activeRepo: string | null
  config: ParsedAndDefaultedContext
}

// Matching the project set by kind:active_repo
type ProjectName = string

interface ProjectConfig {
  // Collection of minimatch patterns to match against the path
  // to determine if the file should be ignored or not
  ignoreGlobs?: string[]
  // Absolute path to the project root
  // Any path that starts with this will have ignoreGlobs applied
  root: string
}

export interface SuperHavenConfig {
  logFile?: string
  port?: number
  binaryDirectory: string
  authToken: string
  projects: Record<ProjectName, ProjectConfig>
}

export type DieFunc = (message: string) => never
