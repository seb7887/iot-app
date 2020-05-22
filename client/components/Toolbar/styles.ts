import { makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.main,
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    padding: theme.spacing(2, 3),
    minHeight: '85px',
    flexShrink: 0
  },
  toolbarWrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  toolbarHeader: {
    marginLeft: theme.spacing(3)
  },
  title: {
    fontFamily: 'Bungee Inline'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  toolbarActions: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%'
  }
}))
