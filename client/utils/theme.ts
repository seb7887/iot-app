import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#7E52A0'
    },
    secondary: {
      main: '#A2D729'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#181D27'
    },
    text: {
      primary: '#E8F0FF',
      secondary: '#E8F0FF'
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif'
  }
})

export default theme
