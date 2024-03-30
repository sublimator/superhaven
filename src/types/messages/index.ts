import { EditorOutMessage } from './editor-out-messages.ts'
import { AgentOutMessage } from './agent-out-messages.ts'

export type AgentMessage = AgentOutMessage | EditorOutMessage
