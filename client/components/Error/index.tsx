import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ErrorIcon from '@material-ui/icons/Error'

interface Props {
  message?: string
}

const Error: React.FunctionComponent<Props> = ({ message }) => {
  const styles = useStyles()

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      style={{ height: '100%' }}
    >
      <Grid container justify="center" alignItems="center" direction="column">
        <ErrorIcon className={styles.icon} />
        <Typography variant="h5" className={styles.legend}>
          {message || 'Oops, something went wrong'}
        </Typography>
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  divider: {
    margin: theme.spacing(0, 2)
  },
  legend: {
    color: theme.palette.error.main,
    padding: theme.spacing(2)
  },
  icon: {
    marginBottom: theme.spacing(2),
    fontSize: '3rem',
    color: theme.palette.error.main
  }
}))

export default Error
