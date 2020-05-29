import { makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.default
  },
  title: {
    '& h2': {
      fontFamily: 'Bungee Inline',
      color: theme.palette.primary.main
    }
  },
  content: {
    padding: theme.spacing(4)
  }
}))
