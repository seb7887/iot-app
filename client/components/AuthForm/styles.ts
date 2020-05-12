import { makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  formActions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinner: { margin: theme.spacing(2) },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  link: {
    '&:hover': {
      cursor: 'pointer'
    }
  },
  alert: {
    margin: theme.spacing(3, 0)
  }
}))
