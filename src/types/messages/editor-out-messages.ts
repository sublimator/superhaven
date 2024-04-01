/*******************************************************************************
 * Messages sent from editor to sm-agent stdin
 * All messages are \n separated JSON encoded objects
 */

// { kind: 'file_update', path: 'foo.txt', content: prompt.value },
export interface EditorFileUpdate {
  kind: 'file_update'
  path: string
  content: string
}

// { kind: 'cursor_update', path: 'foo.txt', offset: utf8StringLength(prompt.value) },
export interface EditorCursorPositionUpdate {
  kind: 'cursor_update'
  path: string
  offset: number
}

export type EditorStateUpdate = EditorFileUpdate | EditorCursorPositionUpdate

export interface EditorStateUpdateMessage {
  kind: 'state_update'
  newId: string
  updates: Array<EditorStateUpdate>
}

export interface EditorGreetingMessage {
  kind: 'greeting'
  allowGitignore: boolean
}

export type EditorOutMessage = EditorStateUpdateMessage | EditorGreetingMessage
