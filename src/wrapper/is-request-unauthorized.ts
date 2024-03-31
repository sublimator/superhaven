import { IncomingMessage } from 'node:http'
import { AgentContext } from './types.ts'
import { nonNullable } from '../utils/non-nullable.ts'

export function isRequestUnauthorized(
  request: IncomingMessage,
  context: AgentContext
) {
  const url = new URL(
    nonNullable(request.url, 'request.url not set'),
    `http://localhost:${context.config.port}`
  )
  const authToken = context.config.authToken
  const token = url.searchParams.get('token')
  const noAuthHeader =
    !request.headers.authorization ||
    request.headers.authorization !== `Bearer ${authToken}`
  return noAuthHeader && token !== authToken
}
