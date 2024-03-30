import { AgentMessage } from '../types/messages'

export function getMessagePairingId(message: AgentMessage) {
  if (message.kind === 'state_update') {
    return message.newId
  }
  if (message.kind === 'response') {
    return message.stateId
  }
  return null
}
