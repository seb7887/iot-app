import { makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) => ({
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
