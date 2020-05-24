import React from 'react'
import Grid from '@material-ui/core/Grid'
import Linear from '@material-ui/core/LinearProgress'
import Circular from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

interface Props {
  message?: string
  linear?: boolean
}

const Loader: React.FunctionComponent<Props> = ({ message, linear }) => (
  <Grid
    container
    direction="column"
    justify="center"
    alignItems="center"
    style={{ height: '100%' }}
  >
    {linear ? <Linear /> : <Circular />}
    {message && (
      <Typography
        variant="h5"
        style={{ marginTop: '1rem' }}
        color="textPrimary"
      >
        {message}
      </Typography>
    )}
  </Grid>
)

export default Loader
