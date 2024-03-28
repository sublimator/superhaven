import { AgentMessage } from './messages.ts'

export interface EventData {
  id: number // auto incrementing id
  type: 'input' | 'output'
  data: AgentMessage
}
