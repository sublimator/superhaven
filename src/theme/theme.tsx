import { createTheme } from '@mui/material'

export const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Switch to dark mode
    // You can customize your color palette here
    primary: {
      main: '#90caf9' // Example of a primary color
    },
    secondary: {
      main: '#f48fb1' // Example of a secondary color
    },
    background: {
      default: '#121212', // Dark background color
      paper: '#424242' // Color for Paper components
    }
    // Add other color overrides if needed
  }
  // Customize typography, breakpoints, or other theme properties if necessary
})
