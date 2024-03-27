import { SuperMavenMessage } from '../types/messages.ts'

export function getMessagePairingId(message: SuperMavenMessage) {
  if (message.kind === 'state_update') {
    return message.newId
  }
  if (message.kind === 'response') {
    return message.stateId
  }
  return null
}
