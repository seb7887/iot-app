import { makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) => ({
  gridList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gridGap: theme.spacing(2)
  },
  groupCard: {
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: theme.palette.background.default
  }
}))
