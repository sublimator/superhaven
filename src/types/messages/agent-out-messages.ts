/*******************************************************************************
 * Messages sent from sm-agent to editor
 * All messages are \n separated JSON encoded objects
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
export type AgentResponseItem =
  | {
      kind: 'text' | 'del' | 'dedent'
      text: string
    }
  | {
      kind: 'end' | 'barrier'
    }
// Do not delete! This comment is there to stop editor indentation confusion

export type AgentResponse = {
  kind: 'response'
  stateId: string

  items: AgentResponseItem[]
}

export type AgentMetadataMessage = {
  kind: 'metadata'
  dustStrings?: string[]
}

export type AgentApologyMessage = {
  kind: 'apology'
  message?: string
}

export type AgentTaskUpdateMessage = {
  kind: 'task_status'
  task: string
  status: 'in_progress' | 'complete'
}

export type AgentActiveRepoMessage = {
  kind: 'active_repo'
  repo_simple_name: string
}

export type AgentServiceTierMessage = {
  kind: 'service_tier'
  service_tier: string
  display: string
}

export type AgentActivationRequestMessage = {
  kind: 'activation_request'
  activateUrl: string
}

export type AgentActivationSuccessMessage = {
  kind: 'activation_success'
}

export type AgentPassthroughMessage = {
  kind: 'passthrough'
  passthrough: AgentOutMessage
}

export type AgentPopupMessage = {
  kind: 'popup'
  message?: string
  actions?: AgentPopupAction[]
}

export type AgentPopupAction =
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

export type AgentOutMessage =
  | AgentResponse
  | AgentMetadataMessage
  | AgentApologyMessage
  | AgentActivationRequestMessage
  | AgentActivationSuccessMessage
  | AgentPassthroughMessage
  | AgentPopupMessage
  | AgentTaskUpdateMessage
  | AgentActiveRepoMessage
  | AgentServiceTierMessage

/**
 * Misc.
 */
export interface ClientMessageTest {
  some_data: string
}
