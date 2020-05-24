import { makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) => ({
  table: {
    backgroundColor: theme.palette.background.default
  },
  searchMenu: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing(1)
  },
  clear: {
    cursor: 'pointer',
    paddingLeft: theme.spacing(2)
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  row: {
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      opacity: 0.75
    }
  }
}))
