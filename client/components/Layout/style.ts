import { makeStyles, Theme } from '@material-ui/core/styles'

const drawerWidth = 240

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    overflowY: 'scroll',
    overflowX: 'hidden',
    height: '100%'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  }
}))
