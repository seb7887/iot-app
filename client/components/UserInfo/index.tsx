import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { useStyles } from './styles'

interface Props {
  data: User
}

const UserInfo: React.FunctionComponent<Props> = ({ data }) => {
  const styles = useStyles()

  return (
    <Container className={styles.container}>
      <Paper className={styles.paper} elevation={6}>
        <Grid container direction="row" justify="space-between">
          <Grid>
            {data.avatar ? (
              <Avatar
                alt={data.username}
                src={data.avatar}
                className={styles.imageAvatar}
              />
            ) : (
              <Avatar className={styles.charAvatar}>
                {data.username.charAt(0)}
              </Avatar>
            )}
          </Grid>
          <Grid>
            <Typography variant="body1">
              More info will be added here...
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default UserInfo
