import { makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) => ({
  menuItem: {
    padding: theme.spacing(1, 5),
    backgroundColor: theme.palette.background.default
  }
}))
