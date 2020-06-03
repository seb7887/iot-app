import { makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) => ({
  spinner: {
    height: '100vh',
    width: '100vw'
  },
  container: {
    padding: theme.spacing(3)
  },
  topLevel: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.primary
  },
  paper: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.default
  },
  search: {
    marginLeft: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default
  },
  searchTextField: {
    padding: 0,
    flexGrow: 2
  },
  buttonGroup: {
    heigth: '100%'
  }
}))
