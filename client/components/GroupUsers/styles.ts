import { makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) => ({
  section: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(2, 0, 2, 0),
    '&:first-of-type': {
      marginTop: 0
    }
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  moreButton: {
    width: '100%',
    marginTop: theme.spacing(2)
  },
  userTitle: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridGap: theme.spacing(1),
    padding: theme.spacing(2)
  },
  userGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridGap: theme.spacing(1),
    padding: theme.spacing(2)
  },
  paper: {
    background: `${theme.palette.background.default} !important`
  }
}))
