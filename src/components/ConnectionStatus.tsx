import WifiIcon from '@mui/icons-material/Wifi'
import WifiOffIcon from '@mui/icons-material/WifiOff'
import { Box, BoxProps } from '@mui/material'

export interface ConnectionStatusProps {
  connected: boolean
  sx?: BoxProps['sx']
}

export const ConnectionStatus = ({ connected, sx }: ConnectionStatusProps) => {
  return (
    <Box display='flex' alignItems='center' sx={sx}>
      {connected ? <WifiIcon color='success' /> : <WifiOffIcon color='error' />}
    </Box>
  )
}

export default ConnectionStatus
