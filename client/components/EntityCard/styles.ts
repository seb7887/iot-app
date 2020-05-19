import { makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) => ({
  card: {
    backgroundColor: theme.palette.background.default,
    borderColor: theme.palette.primary.main
  },
  header: {
    minHeight: '40vh',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'column'
  },
  headerText: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightLight,
    fontFamily: 'Bungee Inline'
  }
}))
