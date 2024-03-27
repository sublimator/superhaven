import {
  ResponseItem,
  StateUpdate,
  SuperMavenMessage
} from '../types/messages.ts'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListItem,
  Typography
} from '@mui/material'
import React from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { InsertDriveFile } from '@mui/icons-material'
import { CursorUpdateIcon } from './CursorUpdateIcon.tsx'

const renderResponseItem = (item: ResponseItem, index: number) => {
  if (item.kind === 'text' || item.kind === 'del' || item.kind === 'dedent') {
    return (
      <Typography key={index} variant='body2'>
        {JSON.stringify(item)}
      </Typography>
    )
  } else {
    return (
      <Typography key={index} variant='body2'>
        {JSON.stringify(item)}
      </Typography>
    )
  }
}
const renderStatusUpdate = (update: StateUpdate, index: number) => {
  switch (update.kind) {
    case 'file_update':
      return (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <InsertDriveFile />
            <Typography>{update.path}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant='body2'>Content:</Typography>
            <Typography
              variant='body2'
              style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >
              {update.content}
            </Typography>
          </AccordionDetails>
        </Accordion>
      )
    case 'cursor_update':
      return (
        <ListItem
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CursorUpdateIcon />
            {/*<Typography>{update.path}</Typography>*/}
            <Typography variant='body2'>Offset: {update.offset}</Typography>
          </Box>
        </ListItem>
      )
    default:
      return null // Or a suitable fallback
  }
}
export const StateUpdateComponent: React.FC<{ updates: StateUpdate[] }> = ({
  updates
}) => {
  return (
    <List>
      {updates.map((update, index) => renderStatusUpdate(update, index))}
    </List>
  )
}
const renderMessageContent = (message: SuperMavenMessage) => {
  switch (message.kind) {
    case 'response':
      return (
        <div>
          {message.items.map((item, index) => renderResponseItem(item, index))}
        </div>
      )
    case 'apology':
      return <Typography variant='body2'>{message.message}</Typography>
    case 'task_status':
      return (
        <Typography variant='body2'>
          Task {message.task} is {message.status}.
        </Typography>
      )
    case 'state_update':
      return (
        <div>
          <StateUpdateComponent updates={message.updates} />
        </div>
      )
    case 'popup':
      return (
        <div>
          <Typography variant='body2'>{message.message}</Typography>
          {message.actions?.map((action, index) => (
            <Typography key={index} variant='body2'>
              Action: {action.label}
            </Typography>
          ))}
        </div>
      )
    case 'passthrough':
      return (
        <div>
          <Typography variant='body2'>{JSON.stringify(message)}</Typography>
        </div>
      )
    default:
      return (
        <Typography variant='body2'>
          Unsupported message type: {JSON.stringify(message)}
        </Typography>
      )
  }
}
export const MessageComponent: React.FC<{
  type: 'input' | 'output'
  data: SuperMavenMessage
}> = ({ data }) => {
  return renderMessageContent(data)
}
