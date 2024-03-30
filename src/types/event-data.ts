import { AgentMessage } from './messages'

export interface EventData {
  id: number // auto incrementing id
  type: 'input' | 'output'
  data: AgentMessage & { ignored?: boolean }
}
