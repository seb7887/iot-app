import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  buttonPanel: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end'
  }
}))
