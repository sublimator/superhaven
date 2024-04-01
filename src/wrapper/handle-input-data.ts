import { AgentContext, EventSink, LogSink } from './types.ts'
import { minimatch } from 'minimatch'

import { EditorOutMessage } from '../types/messages/editor-out-messages.ts'

function findProjectName(path: string, context: AgentContext) {
  const projectNames = Object.keys(context.config.projects)
  for (const projectName of projectNames) {
    const projectConfig = context.config.projects[projectName]
    if (path.startsWith(projectConfig.root)) {
      return projectName
    }
  }
  return null
}

function isIgnored(path: string, context: AgentContext) {
  const projectName = findProjectName(path, context)
  if (!projectName) {
    return false
  }
  const projectConfig = context.config.projects[projectName]
  if (!projectConfig) {
    return false
  }
  const ignoreGlobs = projectConfig.ignoreGlobs
  if (!ignoreGlobs) {
    return false
  }

  return ignoreGlobs.some(glob => minimatch(path, glob))
}

function isIgnoredMessage(message: EditorOutMessage, context: AgentContext) {
  if (message.kind !== 'state_update') {
    return false
  }
  return message.updates.some(update => {
    if (update.kind !== 'file_update' && update.kind !== 'cursor_update') {
      return false
    }
    const path = update.path
    return isIgnored(path, context)
  })
}

export function makeHandleInputData(
  log: LogSink,
  sendEvent: EventSink,
  context: AgentContext
) {
  let inputBuffer = ''
  return function handleInputData(
    data: Buffer,
    stream: NodeJS.WritableStream
  ): void {
    inputBuffer += data.toString()
    let newlineIndex: number
    while ((newlineIndex = inputBuffer.indexOf('\n')) !== -1) {
      const line = inputBuffer.substring(0, newlineIndex + 1)
      log(`INPUT: ${line}`)
      const editorMessage = JSON.parse(line.trim()) as EditorOutMessage
      if (context.isEnabled) {
        let ignored = false
        try {
          ignored = isIgnoredMessage(editorMessage, context)
        } catch (e) {
          log(
            `error trying check ignored status ${e} ${JSON.stringify(context.config)}`
          )
        }
        if (ignored) {
          sendEvent('input', { ...editorMessage, ignored: true })
        } else {
          stream.write(line.includes('\n') ? line : line + '\n')
          sendEvent('input', editorMessage)
        }
      }
      inputBuffer = inputBuffer.substring(newlineIndex + 1)
    }
  }
}
