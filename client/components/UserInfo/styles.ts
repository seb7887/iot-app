import { makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: '100vh'
  },
  paper: {
    margin: theme.spacing(6),
    padding: theme.spacing(4),
    alignSelf: 'center',
    backgroundColor: `${theme.palette.background.default} !important`
  },
  imageAvatar: {
    width: theme.spacing(22),
    height: theme.spacing(22)
  },
  charAvatar: {
    backgroundColor: theme.palette.primary.main,
    width: theme.spacing(22),
    height: theme.spacing(22),
    fontSize: theme.spacing(20)
  }
}))
