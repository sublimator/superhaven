import { SuperMavenMessage } from './messages.ts'

export interface EventData {
  id: number // auto incrementing id
  // input is stdin, output is stdout
  type: 'input' | 'output'
  data: SuperMavenMessage
}
