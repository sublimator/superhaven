import { AgentMessage } from '../types/messages.ts'

export function getMessagePairingId(message: AgentMessage) {
  if (message.kind === 'state_update') {
    return message.newId
  }
  if (message.kind === 'response') {
    return message.stateId
  }
  return null
}
