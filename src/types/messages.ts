/**
 * Outbound messages (sent to stdin)
 */

// { kind: 'file_update', path: 'foo.txt', content: prompt.value },
export interface FileUpdate {
  kind: 'file_update'
  path: string
  content: string
}

// { kind: 'cursor_update', path: 'foo.txt', offset: utf8StringLength(prompt.value) },
export interface CursorPositionUpdate {
  kind: 'cursor_update'
  path: string
  offset: number
}

export type StateUpdate = FileUpdate | CursorPositionUpdate

export interface StateUpdateMessage {
  kind: 'state_update'
  newId: string
  updates: Array<StateUpdate>
}

export type ToBinaryMessage = StateUpdateMessage

/**
 * Inbound messages (sent to stdout from the binary)
 */

/**
 * End and barrier mean, stop the completion there
 * Dedent means, delete this text prior to the cursor when the completion is accepted
 * Don't worry about del, you can ignore it
 * "barrier is just a tab stop inside one "completion " ?  end is the end of the completion?"
 * Jacob: Yes
 * Dedent seems to act upon the previous item, removing equivalent space from it
 * Wonder how that works? Hard to tell
 */
export type ResponseItem =
  | {
      kind: 'text' | 'del' | 'dedent'
      text: string
    }
  | {
      kind: 'end' | 'barrier'
    }

export type BinaryResponse = {
  kind: 'response'
  stateId: string

  items: ResponseItem[]
}

export type BinaryMetadataMessage = {
  kind: 'metadata'
  dustStrings?: string[]
}

export type BinaryApologyMessage = {
  kind: 'apology'
  message?: string
}

export type BinaryTaskUpdateMessage = {
  kind: 'task_status'
  task: string
  status: 'in_progress' | 'complete'
}

export type BinaryActiveRepoMessage = {
  kind: 'active_repo'
  repo_simple_name: string
}

export type BinaryServiceTierMessage = {
  kind: 'service_tier'
  service_tier: string
  display: string
}

export type BinaryActivationRequestMessage = {
  kind: 'activation_request'
  activateUrl: string
}

export type BinaryActivationSuccessMessage = {
  kind: 'activation_success'
}

export type BinaryPassthroughMessage = {
  kind: 'passthrough'
  passthrough: FromBinaryMessage
}

export type BinaryPopupMessage = {
  kind: 'popup'
  message?: string
  actions?: BinaryPopupAction[]
}

export type BinaryPopupAction =
  | {
      kind: 'open_url'
      label: string
      url: string
    }
  | {
      kind: 'no_op'
      label: string
    }
// Do not delete! This comment is there to stop editor indentation confusion

export type FromBinaryMessage =
  | BinaryResponse
  | BinaryMetadataMessage
  | BinaryApologyMessage
  | BinaryActivationRequestMessage
  | BinaryActivationSuccessMessage
  | BinaryPassthroughMessage
  | BinaryPopupMessage
  | BinaryTaskUpdateMessage
  | BinaryActiveRepoMessage
  | BinaryServiceTierMessage

/**
 * Misc.
 */
export interface ClientMessageTest {
  some_data: string
}

export type SuperMavenMessage = FromBinaryMessage | ToBinaryMessage
