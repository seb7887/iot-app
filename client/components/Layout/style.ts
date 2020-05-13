import { makeStyles, Theme } from '@material-ui/core/styles'

const drawerWidth = 240

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  sidebar: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default
  },
  brand: {
    marginBottom: theme.spacing(2),
    cursor: 'pointer'
  },
  divider: {
    backgroundColor: theme.palette.primary.main
  },
  icon: {
    color: theme.palette.text.primary
  },
  item: {
    transition: 'all 0.2s',
    color: theme.palette.text.primary,
    '&:hover': {
      opacity: 0.5,
      color: theme.palette.primary.main
    }
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3)
  }
}))
