// Define types for the event data
import { EditorOutMessage } from '../types/messages/editor-out-messages.ts'

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

export interface SetAllowGitignoreCommand extends Command {
  kind: 'set-allow-gitignore'
  allowGitignore: boolean
}

export interface InitCommand extends Command {
  kind: 'init'
  data: AgentContext
}

export type ClientMessage =
  | DieCommand
  | SetEnabledCommand
  | SetAllowGitignoreCommand
export type ServerMessage = InitCommand

export interface WebSocketMessageHandler {
  (data: ClientMessage, sendMessage: (message: object) => void): void
}

export interface ParsedAndDefaultedConfig extends SuperHavenConfig {
  port: number
}

export interface AgentEnv {
  SM_EDITOR?: string
  SM_EDITOR_VERSION?: string
  SM_EXTENSION_VERSION?: string
  SM_LOG_PATH?: string
}

export interface AgentContext {
  isEnabled: boolean
  binaryVersion: number
  activeRepo: string | null
  env: AgentEnv
  config: ParsedAndDefaultedConfig
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
  // TODO: make this support multiple extensions
  // This seems only really to de be needed because it's hard to get
  // folder of the original symlink path executed from the extension
  binaryDirectory: string
  startMessages?: EditorOutMessage[]
  authToken: string
  projects: Record<ProjectName, ProjectConfig>
}

export type DieFunc = (message: string) => never
