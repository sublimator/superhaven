import {
  Box,
  Button,
  Card,
  Container,
  ListItem,
  ThemeProvider,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { CompareArrows } from '@mui/icons-material'
import { EventData } from '../types/event-data.ts'
import { useWebSocket } from '../hooks/useWebSocket.ts'
import { darkTheme } from '../theme/theme.tsx'
import { IGNORED_BG, INPUT_BG, OUTPUT_BG } from '../theme/colors.ts'
import { MessageComponent } from './MessageComponent.tsx'
import { getMessagePairingId } from './getMessagePairingId.ts'
import { InfoTable } from './InfoTable.tsx'
import type { ServerMessage } from '../wrapper/types.ts'
import { nonNullable } from '../utils/non-nullable.ts'

const token = process.env.SUPER_HAVEN_AUTH_TOKEN!

export const DashBoard: React.FC = () => {
  const [stateId, setStateId] = useState<string | null>(null)
  const [activeRepo, setActiveRepo] = useState<string | null>(null)
  const [serviceTier, setServiceTier] = useState<string | null>(null)
  const [enabled, setEnabled] = useState<boolean>(true)
  const [binaryVersion, setBinaryVersion] = useState<number | null>(null)

  const state = {
    binaryVersion,
    token,
    stateId,
    activeRepo,
    serviceTier
  }

  const { messages, connected, totalMessages, sendMessage } = useWebSocket<
    EventData,
    ServerMessage
  >({
    url: nonNullable(
      process.env.SUPER_HAVEN_WS_URL,
      'process.env.SUPER_HAVEN_WS_URL not set'
    ),
    token: token,
    reconnect: true,
    keepUpTo: 50,
    isMessageBuffered: message => {
      return 'type' in message && !('kind' in message)
    },
    processMessage: JSON.parse.bind(JSON),
    onClose: () => {
      setActiveRepo(null)
      setServiceTier(null)
      setStateId(null)
      setBinaryVersion(null)
    },
    onCommand: command => {
      if (command.kind === 'init') {
        setEnabled(command.data.isEnabled)
        setBinaryVersion(command.data.binaryVersion)
      }
    },
    onMessage: message => {
      if (message.data.kind === 'state_update') {
        const stateUpdateMessage = message.data
        setStateId(stateUpdateMessage.newId)
      }
      if (message.data.kind === 'passthrough') {
        const passthrough = message.data.passthrough
        if (passthrough.kind === 'active_repo') {
          setActiveRepo(passthrough.repo_simple_name)
        } else if (passthrough.kind === 'task_status') {
          // TODO: handle task status
        } else if (passthrough.kind === 'service_tier') {
          setServiceTier(passthrough.service_tier)
        }
      }
    }
  })

  function die() {
    sendMessage({ kind: 'die' })
  }

  function toggleEnabled() {
    setEnabled(val => {
      const newVal = !val
      sendMessage({
        kind: 'set-enabled',
        enabled: newVal
      })
      return newVal
    })
  }

  return (
    <ThemeProvider theme={darkTheme}>
      {/*box fiexd to the left*/}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <Box
          className='ease-in-half-second'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end'
          }}
        >
          <img src='/apple-touch-icon.png' alt='apple touch icon' />
        </Box>

        <Box>
          <Typography variant='h1' gutterBottom id='superhaven-title'>
            SuperHaven
          </Typography>
          <Container maxWidth='md'>
            <Box>
              {messages.map((m, ix) => {
                const id = getMessagePairingId(m.data)
                const passthrough = m.data.kind === 'passthrough'
                return (
                  <Box
                    key={ix}
                    maxWidth='md'
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      backgroundColor:
                        m.type === 'input'
                          ? m.data.ignored
                            ? IGNORED_BG
                            : INPUT_BG
                          : OUTPUT_BG
                    }}
                  >
                    {(id || passthrough) && (
                      <Box>
                        <Card
                          sx={{
                            p: 1,
                            m: 2,
                            boxSizing: 'border-box',
                            borderRadius: '5px',
                            border: `3px solid ${
                              id === stateId ? 'darkgreen' : 'transparent'
                            }`
                          }}
                        >
                          <Typography
                            sx={{
                              width: '2rem'
                            }}
                            variant='body2'
                          >
                            {(id && id) || (passthrough && <CompareArrows />)}
                          </Typography>
                        </Card>
                      </Box>
                    )}
                    <ListItem>
                      <MessageComponent type={m.type} data={m.data} />
                    </ListItem>
                  </Box>
                )
              })}
            </Box>
          </Container>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end'
          }}
        >
          <InfoTable
            state={state}
            connected={connected}
            seenMessages={totalMessages}
            messages={messages.length}
          />
          <Box
            className='ease-in-half-second'
            sx={{
              mt: 1,
              width: '100%',
              gap: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Button
              onClick={die}
              disabled={!connected}
              sx={{ flexGrow: 1 }}
              variant='outlined'
            >
              Die
            </Button>

            <Button
              disabled={!connected}
              sx={{ flexGrow: 1 }}
              variant={enabled ? 'outlined' : 'contained'}
              onClick={toggleEnabled}
            >
              {enabled ? 'Disable' : 'Enable'}
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
