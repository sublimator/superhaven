import React from 'react'
import { Box, Tooltip } from '@mui/material'
import ConnectionStatus from './ConnectionStatus.tsx'
import { ellipsis } from '../utils/ellipsis.ts'

interface InfoProps {
  connected: boolean
  messages: number
  seenMessages?: number | null
  state: {
    binaryVersion: number | null
    token: string
    env: object
    serviceTier: string | null
    // stateId
    stateId: string | null
    activeRepo: string | null
  }
}

const UN_KNOWN = (
  <Tooltip title='Not yet known, can use DIE to refresh'>
    <span>(waiting)</span>
  </Tooltip>
)

export const InfoTable: React.FC<InfoProps> = ({
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
          <td>Binary Version</td>
          <td>{state.binaryVersion ?? UN_KNOWN}</td>
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
          <td>{state.stateId ?? UN_KNOWN}</td>
        </tr>
        <tr>
          <td>Active repo</td>
          <td>{state.activeRepo ?? UN_KNOWN}</td>
        </tr>
        <tr>
          <td>Service tier</td>
          <td>{state.serviceTier ?? UN_KNOWN}</td>
        </tr>
        {Object.entries(state.env).map(([key, value]) => (
          <tr key={key}>
            <td>
              <Tooltip title={key}>
                <span>{ellipsis(key, 10)}</span>
              </Tooltip>
            </td>
            <td>
              <Tooltip title={value}>
                <span>{ellipsis(value, 10)}</span>
              </Tooltip>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
