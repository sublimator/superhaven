import React from 'react'
import { Box } from '@mui/material'
import ConnectionStatus from './ConnectionStatus.tsx'
import { ellipsis } from '../utils/ellipsis.ts'

interface ConnectionProps {
  connected: boolean
  messages: number
  seenMessages?: number | null
  state: {
    token: string
    serviceTier: string | null
    // stateId
    stateId: string | null
    activeRepo: string | null
  }
}

export const ConnectionTable: React.FC<ConnectionProps> = ({
  connected,
  messages,
  seenMessages,
  state
}) => {
  return (
    <table id='status-table'>
      <tbody>
        <tr>
          <td>Connection</td>
          <td>
            <Box
              sx={{
                display: 'flex',
                flexAlign: 'end',
                flexDirection: 'row-reverse'
              }}
            >
              <ConnectionStatus connected={connected} />
            </Box>
          </td>
        </tr>
        <tr>
          <td>Token</td>
          <td>{ellipsis(state.token, 10)}</td>
        </tr>
        <tr>
          <td>Messages</td>
          <td>
            {messages} / {seenMessages ?? 0}
          </td>
        </tr>
        <tr>
          <td>State</td>
          <td>{state.stateId ?? 'N/A'}</td>
        </tr>
        <tr>
          <td>Active repo</td>
          <td>{state.activeRepo ?? 'N/A'}</td>
        </tr>
        <tr>
          <td>Service tier</td>
          <td>{state.serviceTier ?? 'N/A'}</td>
        </tr>
      </tbody>
    </table>
  )
}
